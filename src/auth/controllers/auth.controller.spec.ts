import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/entities/user.entity';
import { Types } from 'mongoose';

import { AuthService } from '../services/auth.service';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginDto } from '../dtos/login.dto';

import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ]
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should call AuthService.register and return a user', async () => {
      const registerUserDto: RegisterUserDto = {
        email: 'khaldmansour93@gmail.com',
        password: 'password123',
        firstName: 'Khaled',
        lastName: 'Mansour'
      };      
      const mockUser: User = {
        _id: new Types.ObjectId('60db69d010f5b2d1a8a5fbd3'),
        email: 'khaldmansour93@gmail.com',
        firstName: 'Khaled',
        lastName: 'Mansour',
        password: 'hashed-password'
      };
      mockAuthService.register.mockResolvedValue(mockUser);

      const result = await authController.register(registerUserDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(registerUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should call AuthService.login and return an access token', async () => {
      const loginDto: LoginDto = {
        email: 'khaldmansour93@gmail.com',
        password: 'password123'
      };
      const mockAccessToken = 'mock-jwt-token';
      mockAuthService.login.mockResolvedValue({ access_token: mockAccessToken });

      const result = await authController.login(loginDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual({ access_token: mockAccessToken });
    });
  });
});
