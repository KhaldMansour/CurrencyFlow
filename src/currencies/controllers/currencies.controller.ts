import {
  Controller,
  Get,
  Query,
  Request
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CurrenciesService } from '../services/currencies.service';
import { CurrencyConversionRequestDto } from '../dto/currency-conversion.request.dto';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get('exchange-rate')
  async convert(@Query('currency') currency: string): Promise<{conversion_rates: Record<string, number>}> {
    return this.currenciesService.getExchangeRate(currency);
  }

  @ApiBearerAuth('JWT')
  @Get('convert')
  async create(
    @Query() data: CurrencyConversionRequestDto,
    @Request() request: ExpressRequest
  ): Promise<{ convertedAmount: number }> {
    const user = request.user;
    return await this.currenciesService.convert(data, user);
  }
}
