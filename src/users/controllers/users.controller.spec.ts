import { Test, TestingModule } from '@nestjs/testing';
import { Request as ExpressRequest } from 'express';
import { Types } from 'mongoose';

import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';

import { UsersController } from './users.controller';

const mockUsersService = {
  getTransactionHistory: jest.fn()
};

const mockUser: User = {
  _id: new Types.ObjectId('60db69d010f5b2d1a8a5fbd3'),
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'hashed-password'
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService
        }
      ]
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('history', () => {
    it('should return transaction history for the current user', async () => {
      const mockTransactions= [
        { _id: 'transaction-id-1', amount: 100, type: 'credit', userId: 'mock-user-id' },
        { _id: 'transaction-id-2', amount: 50, type: 'debit', userId: 'mock-user-id' }
      ];
      mockUsersService.getTransactionHistory.mockResolvedValue(mockTransactions);
      const mockRequest = {
        user: mockUser
      }  as ExpressRequest;

      const result = await usersController.history(mockRequest);

      expect(mockUsersService.getTransactionHistory).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual(mockTransactions);
    });

    it('should handle errors from UsersService gracefully', async () => {
      const errorMessage = 'Error fetching transaction history';
      mockUsersService.getTransactionHistory.mockRejectedValue(new Error(errorMessage));
      const mockRequest = {
        user: mockUser
      }  as ExpressRequest;

      try {
        await usersController.history(mockRequest);
      } catch (e) {
        expect(e.message).toBe(errorMessage);
      }

      expect(mockUsersService.getTransactionHistory).toHaveBeenCalledWith(mockUser._id);
    });
  });
});
