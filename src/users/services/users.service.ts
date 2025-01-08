import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from 'src/currencies/entities/transaction.entity';

import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>
  ) {}
  async findById(id: string): Promise<User> {   
    const user = await this.userModel.findById(new Types.ObjectId(id));

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getTransactionHistory(userId: Types.ObjectId): Promise<Transaction[]> {
    return await this.transactionModel
      .find({ user: userId })
      .sort({ createdAt: -1 });
  }
}
