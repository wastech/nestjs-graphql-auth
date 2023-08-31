import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserInput } from './dto/user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getUsersWithPagination(page: number, limit: number): Promise<User[]> {
    const skip = (page - 1) * limit;
    return this.userModel.find().skip(skip).limit(limit).exec();
  }

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const { name, email, password } = createUserInput;

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async findById(userId: string): Promise<User | null> {
    const userDocument = await this.userModel.findById(userId).exec();
    return userDocument; // Explicitly cast to User type
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(email: string, password: string): Promise<{ accessToken: string; user: User }> {
    const user = await this.validateUser(email, password);

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.generateAccessToken(payload);

    return { accessToken, user };
  }

  generateAccessToken(payload: { sub: string; email: string }): string {
    return this.jwtService.sign(payload);
  }

  async updateUser(id: string, userInput: UserInput): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (userInput.name) {
      user.name = userInput.name;
    }

    if (userInput.email) {
      user.email = userInput.email;
    }

    await user.save();
    return user;
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<User> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordCorrect = await bcrypt.compare(newPassword, user.password);

    if (isPasswordCorrect) {
      throw new BadRequestException('New password cannot be the same as the old password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    return user.save();
  }

  async deleteUserById(userId: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(userId).exec();
  }
}
