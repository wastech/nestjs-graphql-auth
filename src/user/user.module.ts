import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User, UserSchema } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt'; // Import the JwtModule
import { jwtConstants } from './constants';
import { JwtAuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' }, // Adjust token expiration as needed
    }),
  ],
  providers: [UserResolver, UserService,JwtAuthGuard],
})
export class UserModule {}
