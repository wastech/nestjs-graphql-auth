import { Resolver, Query, Context, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { LoginInput } from './dto/login.input';
import { AuthPayload } from './dto/auth-payload.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/auth.guard';
import { UserInput } from './dto/user.input';
import * as bcrypt from 'bcrypt';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async getUsersWithPagination(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<User[]> {
    return this.userService.getUsersWithPagination(page, limit);
  }

  @Mutation((returns) => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return this.userService.createUser(createUserInput);
  }

  //@Public()
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

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard) // Apply the JwtAuthGuard
  async updateUser(
    @CurrentUser() currentUser: User, // Get the authenticated user
    @Args('userId') userId: string,
    @Args('updateData') updateData: UserInput,
  ): Promise<User> {
    // Ensure the authenticated user matches the user being updated
    if (currentUser._id.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to update this user.');
    }

    return this.userService.updateUser(userId, updateData);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async updateUserPassword(
    @CurrentUser() currentUser: User,
    @Args('userId') userId: string,
    @Args('oldPassword') oldPassword: string,
    @Args('newPassword') newPassword: string,
  ): Promise<User> {
    if (currentUser._id.toString() !== userId) {
      throw new ForbiddenException("You are not authorized to update this user's password.");
    }

    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordCorrect) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    return this.userService.updateUserPassword(userId, newPassword);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard) // Apply the JwtAuthGuard
  async deleteUser(@CurrentUser() currentUser: User): Promise<boolean> {
    const deletedUser = await this.userService.deleteUserById(currentUser._id);

    if (deletedUser) {
      // You can perform additional actions here after the user is deleted
      return true;
    }

    return false;
  }
}
