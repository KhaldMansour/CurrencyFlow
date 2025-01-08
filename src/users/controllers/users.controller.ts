import {
  Controller,
  Get,
  Request
} from '@nestjs/common';
import { Transaction } from 'src/currencies/entities/transaction.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Request as ExpressRequest } from 'express';

import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>
  ) {}

  @Get('history')
  async history(@Request() request: ExpressRequest): Promise<Transaction[]> {
    const user = request.user;
    const transactions = await this.transactionModel
      .find({ user: user._id })
      .exec();

    return transactions;
  }
}
