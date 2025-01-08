import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Date, HydratedDocument , Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Exclude, Expose } from 'class-transformer';

@Schema()
export class User {
  _id: Types.ObjectId;

  @Expose()
  @Prop({ required: true })
    firstName: string;

  @Expose()
  @Prop({ required: true })
    lastName: string;

  @Exclude()
  @Prop({ required: true })
    password: string;

  @Expose()
  @Prop({ required: true })
    email: string;

  @Expose()
  @Prop({ type: Date, default: () => Date.now() })
    createdAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;

UserSchema.pre('save', async function (next) {
  const user = this as Document & User;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.__v = undefined;
    ret.password = undefined;
    return ret;
  }
});
