import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';

import { CurrenciesController } from './controllers/currencies.controller';
import { CurrenciesService } from './services/currencies.service';
import { Transaction, TransactionSchema } from './entities/transaction.entity';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema }
    ])
  ],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
  exports: [MongooseModule]
})
export class CurrenciesModule {}
