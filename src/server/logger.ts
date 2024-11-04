import pino from "pino";

const options: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || "debug",
};

if (process.env.NODE_ENV !== "production") {
  options.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  };
}

export const logger = pino(options, pino.destination({ sync: false }));
