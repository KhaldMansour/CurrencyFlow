import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Transaction } from 'src/currencies/entities/transaction.entity';
import { Types } from 'mongoose';

import { User } from '../entities/user.entity';

import { UsersService } from './users.service';

const mockUser = {
  _id: new Types.ObjectId('60db69d010f5b2d1a8a5fbd3'),
  name: 'Khaled Mansour',
  email: 'khaldmansour93@gmail.com'
};

const mockTransactions = [
  {
    _id: new Types.ObjectId('60db69d010f5b2d1a8a5fbd4'),
    user: new Types.ObjectId('60db69d010f5b2d1a8a5fbd3'),
    amount: 100,
    description: 'Payment for services',
    createdAt: new Date('2025-01-07T12:34:56.000Z')
  },
  {
    _id: new Types.ObjectId('60db69d010f5b2d1a8a5fbd5'),
    user: new Types.ObjectId('60db69d010f5b2d1a8a5fbd3'),
    amount: 50,
    description: 'Payment for goods',
    createdAt: new Date('2025-01-06T11:20:00.000Z')
  }
];

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;
  let transactionModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findById: jest
              .fn()
              .mockResolvedValue({
                _id: 'mock-id',
                firstName: 'Khaled',
                lastName: 'Mansour'
              })
          }
        },
        {
          provide: getModelToken(Transaction.name),
          useValue: {
            find: jest.fn().mockReturnValue({
              sort: jest.fn() 
            })
          }
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken(User.name));
    transactionModel = module.get(getModelToken(Transaction.name));
  });

  describe('findById', () => {
    it('should return a user if user is found', async () => {
      const mockUserId = new Types.ObjectId('60db69d010f5b2d1a8a5fbd3');
      jest.spyOn(userModel, 'findById').mockResolvedValue(mockUser as any);

      const user = await service.findById(mockUserId.toString());
      
      expect(user).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const mockUserId = new Types.ObjectId('60db69d010f5b2d1a8a5fbd3');
      jest.spyOn(userModel, 'findById').mockResolvedValue(null);

      await expect(service.findById(mockUserId.toString())).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('getTransactionHistory', () => {
    it('should return transactions for a given user', async () => {
      const userId = new Types.ObjectId('60db69d010f5b2d1a8a5fbd3');
      transactionModel.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([mockTransactions])
      });

      const result = await service.getTransactionHistory(userId);

      expect(result).toEqual([mockTransactions]);
      expect(transactionModel.find).toHaveBeenCalledWith({ user: userId });
      expect(transactionModel.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
    });

    it('should return an empty array if no transactions are found for a user', async () => {
      const mockUserId = new Types.ObjectId('60db69d010f5b2d1a8a5fbd3');
      transactionModel.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([])
      });

      const transactions = await service.getTransactionHistory(mockUserId);
      
      expect(transactions).toEqual([]);
      expect(transactionModel.find).toHaveBeenCalledWith({ user: mockUserId });
      expect(transactionModel.find).toHaveBeenCalledTimes(1);
    });
  });
});
