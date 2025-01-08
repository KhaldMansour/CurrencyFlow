import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John'
  })
  @IsString()
    firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe'
  })
  @IsString()
    lastName: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com'
  })
  @IsEmail()
    email: string;

  @ApiProperty({
    description: 'The password of the user (at least 6 characters)',
    example: 'strongpassword123'
  })
  @MinLength(6)
    password: string;
}
