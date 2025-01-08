import {
  Controller,
  Get,
  Request
} from '@nestjs/common';
import { Transaction } from 'src/currencies/entities/transaction.entity';
import { Request as ExpressRequest } from 'express';

import { UsersService } from '../services/users.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
 
  ) {}

  @Get('history')
  @ApiBearerAuth('JWT')
  async history(@Request() request: ExpressRequest): Promise<Transaction[]> {
    const user = request.user;
    return this.usersService.getTransactionHistory(user._id);
  }
}
