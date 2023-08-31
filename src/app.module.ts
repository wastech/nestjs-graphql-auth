import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserResolver } from './user/user.resolver';
import { UserService } from './user/user.service';
import { JwtModule } from '@nestjs/jwt'; // Import the JwtModule
import { User, UserSchema } from './user/entities/user.entity';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nestjs_graphql_db'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    UserModule,
    JwtModule.register({
      secret: 'your_secret_key', // Change this to a secure key in production
      signOptions: { expiresIn: '1d' }, // Adjust token expiration as needed
    }),
  ],
  providers: [

    UserResolver,
    UserService,
  ],
})
export class AppModule {}
