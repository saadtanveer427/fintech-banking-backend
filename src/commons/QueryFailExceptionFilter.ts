import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch(QueryFailedError, EntityNotFoundError)
export class QueryFailExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError | EntityNotFoundError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    if (exception instanceof QueryFailedError) {
      //@ts-expect-error('')
      if (exception.driverError.code == '23505') {
        let message = '';

        //@ts-expect-error('')
        switch (exception.driverError.constraint) {
          case 'UQ_e12875dfb3b1d92d7d7c5377e22':
            message = 'User with this email already exist';
            break;
          default:
            message = 'Record already exist';
        }

        response.status(400).json({
          statusCode: 400,
          message: message,
        });
      } else {
        console.log(exception.message);
        response.status(500).json({
          statusCode: 500,
          message: 'Something goes wrong',
        });
      }
    } else if (exception instanceof EntityNotFoundError) {
      response.status(400).json({
        statusCode: 400,
        message: 'Bad Request',
      });
    }
  }
}
