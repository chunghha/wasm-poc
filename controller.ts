import { Request, Response } from "https://deno.land/x/oak/mod.ts";

import { CountRequest } from "./count-request.ts";
import { getLogger } from "./log.ts";
import { getWasmComputeFunc } from "./wasm.ts";

export const getCount = async (
  ctx: { request: Request; response: Response },
) => {
  const logger = await getLogger();

  const compute: CallableFunction = await getWasmComputeFunc();
  const maxRounds = 46340;
  const countRequest: CountRequest | undefined = await ctx.request.body().value;
  if (countRequest?.type == undefined || countRequest?.rounds == undefined) {
    ctx.response.status = 400;
    ctx.response.body = {
      error: "Invalid data, request with 'type' and 'rounds'.",
    };
    return;
  }

  if (!(["deno", "rust"].includes(countRequest.type))) {
    ctx.response.status = 400;
    ctx.response.body = { error: "'type' is not 'deno' or 'rust'." };
    return;
  }

  if (countRequest.rounds > maxRounds) {
    ctx.response.status = 400;
    ctx.response.body = { error: "'rounds' is out of bounds." };
    return;
  }

  const scale = 1000000;
  const start = performance.now() * scale;

  let count = 0;
  
  if (countRequest.type == "deno") {
    logger.debug("process deno");
    for (let i = 0; i < countRequest.rounds; i++) {
      for (let j = 0; j < countRequest.rounds; j++) {
        count += 1;
      }
    }
  } else {
    logger.debug("process rust");
    count = compute(countRequest.rounds);
  }

  const duration = performance.now() * scale - start;

  ctx.response.status = 200;
  ctx.response.body = { type: countRequest.type, duration, count };
  logger.info(JSON.stringify(ctx.response.body));
};
