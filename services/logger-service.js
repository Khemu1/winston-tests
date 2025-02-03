import winston from "winston";

const dataFormat = () => {
  return new Date(Date.now()).toLocaleString();
};

class LoggerService {
  constructor(route) {
    this.route = route;

    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.printf((info) => {
        let message = `${dataFormat()} [${info.route}] ${info.message}`;
        message = info.obj
          ? `${message} data: ${JSON.stringify(info.obj)}`
          : message;
        // don't forget to return the message
        return message;
      }),
      transports: [
        new winston.transports.Console(),
        // this will make a file in the log folder with the wanted path
        new winston.transports.File({
          filename: process.cwd() + `/logs/${route}.log`,
        }),
      ],
    });
  }

  logInfo(message) {
    // this a shorthand method instead of writing this.logger.log("info", message), the same apply for others
    this.logger.info({ route: this.route, message });
  }
  logInfo(message, obj) {
    this.logger.info({ route: this.route, message, obj });
  }

  logError(message) {
    this.logger.error({ route: this.route, message });
  }

  logError(message, obj) {
    this.logger.error({ route: this.route, message, obj });
  }

  logDebug(message, obj) {
    this.logger.debug({ route: this.route, message, obj });
  }
}

export default LoggerService;
