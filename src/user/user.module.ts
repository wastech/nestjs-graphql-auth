import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User, UserSchema } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt'; // Import the JwtModule
import { JwtStrategy } from './jwt.strategy'; // Import the JwtStrategy

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'your_secret_key', // Change this to a secure key in production
      signOptions: { expiresIn: '1h' }, // Adjust token expiration as needed
    }),
  ],
  providers: [UserResolver, UserService, JwtStrategy],
})
export class UserModule {}
