import { Router } from "https://deno.land/x/oak/mod.ts";

import { getCount } from "./controller.ts";

const router = new Router();
router.post("/api", getCount);

export default router;
