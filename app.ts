import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import router from "./router.ts";
import { getLogger } from "./log.ts";

const logger = await getLogger();

const PORT = config().PORT || 8000;
const app: Application = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

logger.info(`API started at http://localhost:${PORT}/api`);
await app.listen({ port: +PORT });
