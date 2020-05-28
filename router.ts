import {
  Router,
  Request,
  Response,
} from "https://deno.land/x/oak/mod.ts";
import { getWasmExports } from "./wasm.ts";
import { getLogger } from "./log.ts";

export async function getRouter(): Promise<Router> {
  const logger = await getLogger();

  const router = new Router();

  const rwasm = await getWasmExports();
  const maxRounds = 46340;

  router.post("/api", async (ctx: { request: Request; response: Response }) => {
    const body = await ctx.request.body();
    if (
      body == undefined || body.value.type == undefined ||
      body.value.rounds == undefined
    ) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid data, request with 'type' and 'rounds'." };
      return;
    }

    const type = body.value.type;
    const rounds = body.value.rounds;

    if (!(["deno", "rust"].includes(type))) {
      ctx.response.status = 400;
      ctx.response.body = { error: "'type' is not 'deno' or 'rust'." };
      return;
    }

    if (rounds > maxRounds) {
      ctx.response.status = 400;
      ctx.response.body = { error: "'rounds' is out of bounds." };
      return;
    }

    const scale = 1000000;
    const start = performance.now() * scale;

    let count = 0;
    if (type == "deno") {
      logger.debug("process deno");
      for (let i = 0; i < rounds; i++) {
        for (let j = 0; j < rounds; j++) {
          count += 1;
        }
      }
    } else {
      logger.debug("process rust");
      count = rwasm.compute(rounds);
    }

    const duration = performance.now() * scale - start;

    ctx.response.status = 200;
    ctx.response.body = { type, duration, count };
    logger.info(JSON.stringify(ctx.response.body));
  });

  return router;
}
