import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Types } from 'mongoose';

import { CurrencyConversionRequestDto } from '../dto/currency-conversion.request.dto';

import { CurrenciesService } from './currencies.service';

jest.mock('axios');

const user: User = {
  _id: new Types.ObjectId('60db69d010f5b2d1a8a5fbd3'),
  firstName: 'John',
  lastName: 'Doe',
  password: 'password',
  email: 'john.doe@example.com'
}; 

describe('CurrenciesService', () => {
  let service: CurrenciesService;
  let httpService: HttpService;
  let transactionModel: any;

  beforeEach(async () => {
    transactionModel = { create: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrenciesService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn()
          }
        },
        {
          provide: getModelToken('Transaction'),
          useValue: transactionModel
        }
      ]
    }).compile();

    service = module.get<CurrenciesService>(CurrenciesService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('convert', () => {
    it('should return converted amount and call saveTransaction', async () => {
      const conversionData: CurrencyConversionRequestDto = {
        from: 'USD',
        to: 'EUR',
        amount: 100
      };
      const mockExchangeRateResponse = {
        data: {
          conversion_rates: {
            EUR: 0.85
          }
        }
      };
      (axios.get as jest.Mock).mockResolvedValue(mockExchangeRateResponse);
      transactionModel.create.mockResolvedValue({
        user: user._id,
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
        amount: 100,
        convertedAmount: 85,
        exchangeRate: 0.85
      });
      
      const result = await service.convert(conversionData, user);

      expect(result.convertedAmount).toBe(85);
      expect(transactionModel.create).toHaveBeenCalledWith({
        user: user._id,
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
        amount: 100,
        convertedAmount: 85,
        exchangeRate: 0.85
      });
    });

    it('should throw HttpException if the currency is not supported', async () => {
      const conversionData: CurrencyConversionRequestDto = {
        from: 'USD',
        to: 'INR',
        amount: 100
      };
      const mockExchangeRateResponse = {
        data: {
          conversion_rates: {
            EUR: 0.85
          }
        }
      };
      (axios.get as jest.Mock).mockResolvedValue(mockExchangeRateResponse);

      await expect(service.convert(conversionData, user)).rejects.toThrow(
        new HttpException('Currency not supported', HttpStatus.BAD_REQUEST)
      );
    });

    it('should throw an HttpException if the API call fails', async () => {
      const conversionData: CurrencyConversionRequestDto = {
        from: 'USD',
        to: 'EUR',
        amount: 100
      };

      (axios.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch exchange rates'));

      await expect(service.convert(conversionData, user)).rejects.toThrow(
        HttpException
      );
    });
  });
});
