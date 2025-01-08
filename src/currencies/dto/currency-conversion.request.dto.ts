import { Transform } from 'class-transformer';
import { IsNumber, IsString, IsPositive } from 'class-validator';

export class CurrencyConversionRequestDto {
  @Transform(({ value }) => parseFloat(value)) // Convert string to float
  @IsNumber(
    {},
    {
      message:
        'amount must be a number conforming to the specified constraints'
    }
  )
  @IsPositive({ message: 'amount must be a positive number' })
    amount: number;

  @IsString()
    from: string;

  @IsString()
    to: string;
}
