import { Transform } from 'class-transformer';
import { IsNumber, IsString, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CurrencyConversionRequestDto {
  @ApiProperty({
    description: 'The amount to be converted',
    example: 100,
    type: Number
  })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsPositive({ message: 'amount must be a positive number' })
    amount: number;

  @ApiProperty({
    description: 'The currency code of the amount to be converted (e.g., USD)',
    example: 'USD',
    type: String
  })
  @IsString()
    from: string;

  @ApiProperty({
    description: 'The target currency code for conversion (e.g., EUR)',
    example: 'EUR',
    type: String
  })
  @IsString()
    to: string;
}
