import { injectable } from 'inversify';
import P, { pino } from 'pino';

@injectable()
export default class Logger {
  private baseLogger: P.Logger;

  constructor() {
    this.baseLogger = pino(pino.transport({
      target: 'pino-pretty'
    }));
  }

  public Info(message: string) {
    this.baseLogger.info(message);
  }

  public Debug(message: string) {
    this.baseLogger.debug(message);
  }

  public Error(message: string) {
    this.baseLogger.error(message);
  }
}