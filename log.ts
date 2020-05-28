import * as log from "https://deno.land/std/log/mod.ts";

export async function getLogger() {
  await log.setup({
    handlers: {
      stringFmt: new log.handlers.ConsoleHandler("DEBUG", {
        formatter: "[{levelName}] {datetime} {msg}",
      }),
    },

    loggers: {
      default: {
        level: "DEBUG",
        handlers: ["stringFmt"],
      },
    },
  });

  return log.getLogger();
}
