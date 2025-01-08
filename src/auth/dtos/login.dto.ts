import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com'
  })
  public email: string;

  @MinLength(6)
  @ApiProperty({
    description: 'The password for the user',
    example: 'strongpassword123'
  })
  public password: string;
}
