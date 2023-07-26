// src/common/filters/validation.exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.getContext();
    const response = ctx.res;

    if (exception.getStatus() === 400) {
      const validationErrors = exception.getResponse()['message'];
      const errors = this.formatValidationErrors(validationErrors);

      response.status(400).json({
        statusCode: 400,
        message: 'Validation failed',
        errors,
      });
    } else {
      response.status(exception.getStatus()).json(exception.getResponse());
    }
  }

  private formatValidationErrors(errors: ValidationError[]): any[] {
    return errors.map((error) => {
      if (error.constraints) {
        return {
          field: error.property,
          message: Object.values(error.constraints)[0],
        };
      } else if (error.children && error.children.length > 0) {
        return this.formatValidationErrors(error.children);
      }
    });
  }
}
