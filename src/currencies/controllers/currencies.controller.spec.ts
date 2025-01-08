import { Test, TestingModule } from '@nestjs/testing';

import { CurrenciesService } from '../services/currencies.service';

import { CurrenciesController } from './currencies.controller';

describe('CurrenciesController', () => {
  let controller: CurrenciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrenciesController],
      providers: [CurrenciesService]
    }).compile();

    controller = module.get<CurrenciesController>(CurrenciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
