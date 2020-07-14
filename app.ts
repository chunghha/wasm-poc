import { Application } from "https://deno.land/x/oak/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

import { getLogger } from "./log.ts";
import router from "./router.ts";

const logger = await getLogger();

const app: Application = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = config().PORT || 8000;
logger.info(`API started at http://localhost:${PORT}/api`);
await app.listen({ port: +PORT });
