// custom-request.interface.ts
import { Request } from 'express';
//import { User } from './user.entity'; // Import the User entity or your user data model
import { User } from './user/entities/user.entity';
declare global {
  namespace Express {
    interface Request {
      user?: User; // Replace 'User' with the appropriate user data model
    }
  }
}
