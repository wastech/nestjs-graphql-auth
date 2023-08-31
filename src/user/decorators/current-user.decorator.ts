import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../entities/user.entity'; // Adjust the import path based on your project structure

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    try {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req.user; // Assuming you set the user in the request object in your AuthGuard
    } catch (error) {
      // Handle the exception as needed, e.g., log or throw a custom error
      throw new Error('User not found');
    }
  },
);
