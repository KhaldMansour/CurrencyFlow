import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import axios from 'axios';

import { Transaction } from '../entities/transaction.entity';
import { CurrencyConversionRequestDto } from '../dto/currency-conversion.request.dto';

@Injectable()
export class CurrenciesService {
  private baseUrl: string;
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>
  ) {
    this.baseUrl =
      process.env.EXCHANGE_RATE_URL +
      process.env.EXCHANGE_RATE_API_KEY +
      '/latest/';
  }

  async getExchangeRate(
    currency: string
  ): Promise<{ conversion_rates: Record<string, number> }> {
    const apiUrl = `${this.baseUrl}${currency}`;
    try {
      const response = await axios.get(apiUrl);

      return { conversion_rates: response.data.conversion_rates };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async convert(
    data: CurrencyConversionRequestDto,
    user: User
  ): Promise<{ convertedAmount: number }> {
    const apiUrl = `${this.baseUrl}${data.from}`;
    try {
      const response = await axios.get(apiUrl);
      const conversionRates = response.data.conversion_rates;
      const fromToRate = conversionRates[data.to];

      if (!fromToRate) {
        throw new HttpException(
          'Currency not supported',
          HttpStatus.BAD_REQUEST
        );
      }
      const convertedAmount = data.amount * fromToRate;
      await this.saveTransaction(data, user, convertedAmount);

      return { convertedAmount };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  protected async saveTransaction(
    data: CurrencyConversionRequestDto,
    user: User,
    convertedAmount: number
  ): Promise<Transaction> {
    const transactionData = {
      user: user._id,
      sourceCurrency: data.from,
      targetCurrency: data.to,
      amount: data.amount,
      convertedAmount,
      exchangeRate: convertedAmount / data.amount
    };
    const transaction = await this.transactionModel.create(transactionData);

    return plainToInstance(Transaction, transaction);
  }
}
