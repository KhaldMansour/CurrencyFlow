import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { Types } from 'mongoose';

import { CurrencyConversionRequestDto } from '../dto/currency-conversion.request.dto';
import { CurrenciesService } from '../services/currencies.service';

import { CurrenciesController } from './currencies.controller';

jest.mock('../services/currencies.service');

const mockUser: User = {
  _id: new Types.ObjectId('60db69d010f5b2d1a8a5fbd3'),
  email: 'khaldmansour93@gmail.com',
  firstName: 'Khaled',
  lastName: 'Mansour',
  password: 'hashed-password'
};

describe('CurrenciesController', () => {
  let currenciesController: CurrenciesController;
  let currenciesService: CurrenciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrenciesController],
      providers: [
        {
          provide: CurrenciesService,
          useValue: {
            getExchangeRate: jest.fn(),
            convert: jest.fn()
          }
        }
      ]
    }).compile();

    currenciesController = module.get<CurrenciesController>(CurrenciesController);
    currenciesService = module.get<CurrenciesService>(CurrenciesService);
  });

  describe('convert', () => {
    it('should return converted amount based on user data', async () => {
      const mockConversionData = new CurrencyConversionRequestDto();
      mockConversionData.amount = 100;
      mockConversionData.from = 'USD';
      mockConversionData.to = 'EUR';
      const mockConvertedAmount = 85;
      currenciesService.convert = jest.fn().mockResolvedValue({ convertedAmount: mockConvertedAmount });
      const mockRequest = {
        user: mockUser
      } as Request;

      const result = await currenciesController.create(mockConversionData, mockRequest);

      expect(result).toEqual({ convertedAmount: mockConvertedAmount });
      expect(currenciesService.convert).toHaveBeenCalledWith(mockConversionData, mockUser);
    });
  });

  describe('getExchangeRate', () => {
    it('should return exchange rates for the given currency', async () => {
      const currency = 'USD';
      const mockExchangeRates = { EUR: 0.85, GBP: 0.75 };
      currenciesService.getExchangeRate = jest.fn().mockResolvedValue({ conversion_rates: mockExchangeRates });

      const result = await currenciesController.convert(currency);

      expect(result).toEqual({ conversion_rates: mockExchangeRates });
      expect(currenciesService.getExchangeRate).toHaveBeenCalledWith(currency);
    });
  });
});
