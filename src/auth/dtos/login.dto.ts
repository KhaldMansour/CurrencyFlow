import { MinLength, IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail()
  public email: string;

  @MinLength(6)
  public password: string;
}
