import { Resolver, Query, Context, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { LoginInput } from './dto/login.input';
import { AuthPayload } from './dto/auth-payload.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // @Public()
  @Mutation((returns) => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return this.userService.createUser(createUserInput);
  }

  @Public()
  @Mutation(() => AuthPayload) // Return type includes accessToken and user
  async login(@Args('user') input: LoginInput): Promise<AuthPayload> {
    const { email, password } = input;
    const { accessToken, user } = await this.userService.login(email, password);
    return { accessToken, user };
  }


  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: User): Promise<User> {
   // console.log('Current User:', user); // Add this line
      return user;
    }
  
p
}
