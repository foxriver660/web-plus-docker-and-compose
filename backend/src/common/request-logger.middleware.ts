import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger();

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const statusCode = res.statusCode;
      const statusMessage = res.statusMessage;
      if (statusCode >= 400) {
        this.logger.error(
          `${statusCode} - ${statusMessage} // [${req.method}] ${req.url} `,
        );
      }
    });

    next();
  }
}
