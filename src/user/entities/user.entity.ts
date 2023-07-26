import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

@ObjectType()
@Schema()
export class User extends Document {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @Field()
  @Prop({ required: true, unique: true })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Prop({ required: true })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @Field()
  @Prop({ default: Date.now }) // Use default value to set createdAt
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Before saving the user, hash the password
// UserSchema.pre<User>('save', async function (next) {
//   if (this.isModified('password') || this.isNew) {
//     try {
//       const hashedPassword = await bcrypt.hash(this.password, 10);
//       this.password = hashedPassword;
//     } catch (err) {
//       return next(err);
//     }
//   }
//   next();
// }
//);
