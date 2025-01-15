import { createLogger, format, transports } from "winston"

const logger = createLogger({
  level:
    process.env.NODE_ENV === "test"
      ? "debug"
      : process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp(),
    format.json(),
    format.printf(({ level, message, timestamp, ...metadata }) => {
      let msg = `${timestamp} [${level}]: ${message}`

      if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`
      }

      return msg
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/app.log" }),
    new transports.File({ filename: "logs/errors.log", level: "error" }),
  ],
})

export default logger
