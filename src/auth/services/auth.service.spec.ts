import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginDto } from '../dtos/login.dto';

import { AuthService } from './auth.service';

jest.mock('bcrypt'); 
jest.mock('@nestjs/jwt');

const mockJwtService = {
  signAsync: jest.fn(),
  verifyAsync: jest.fn()
};

describe('AuthService', () => {
  let service: AuthService;
  let userModel: any;
  let jwtService: any;
  let bcryptCompare: jest.Mock;

  beforeEach(async () => {
    userModel = {
      create: jest.fn().mockReturnValue({
        toObject: jest.fn() 
      }),
      findOne: jest.fn()
    };

    bcryptCompare = bcrypt.compare as jest.Mock;
    bcryptCompare.mockResolvedValue(true);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: userModel
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('secret')
          }
        }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerUserDto: RegisterUserDto = {
        firstName: 'Khaled',
        lastName: 'Mansour',
        email: 'khaldmansour93@gmail.com',
        password: 'password123'
      };
      const { password, ...userData } = registerUserDto;
      const createdUser = {
        ...userData,
        _id: 'mock-user-id',
        createdAt: new Date()
      };
      userModel.create.mockReturnValue({
        toObject: jest.fn().mockResolvedValue(createdUser)
      });

      const result = await service.register(registerUserDto);

      expect(result).toEqual(createdUser);
      expect(userModel.create).toHaveBeenCalledWith(registerUserDto);
    });
  });

  describe('login', () => {
    it('should return an access token if credentials are correct', async () => {
      const loginDto = {
        email: 'khaldmansour93@gmail.com',
        password: 'password123'
      };
      const user = {
        _id: 'mock-user-id',
        email: 'khaldmansour93@gmail.com',
        password: 'hashed-password'
      };
      userModel.findOne.mockResolvedValue(user); 
      bcryptCompare.mockResolvedValue(true);
      const mockToken = 'mock-jwt-token';
      mockJwtService.signAsync.mockResolvedValue(mockToken);
  
      const result = await service.login(loginDto);
  
      expect(result).toEqual({ access_token: mockToken });
      expect(userModel.findOne).toHaveBeenCalledWith({ email: loginDto.email });
      expect(bcryptCompare).toHaveBeenCalledWith(
        loginDto.password,
        user.password
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        userId: user._id,
        email: user.email
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const loginDto: LoginDto = {
        email: 'khaldmansour93@gmail.com',
        password: 'password123'
      };

      userModel.findOne.mockResolvedValue(null); 

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException if password Mansours not match', async () => {
      const loginDto: LoginDto = {
        email: 'khaldmansour93@gmail.com',
        password: 'password123'
      };

      const user = {
        _id: 'mock-user-id',
        email: 'khaldmansour93@gmail.com',
        password: 'hashed-password'
      };

      userModel.findOne.mockResolvedValue(user);
      bcryptCompare.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('validateToken', () => {
    it('should return the decoded token payload', async () => {
      const mockToken = 'mock-jwt-token';
      const decodedPayload = {
        userId: 'mock-user-id',
        email: 'khaldmansour93@gmail.com'
      };
      mockJwtService.verifyAsync.mockResolvedValue(decodedPayload);

      const result = await service.validateToken(mockToken);

      expect(result).toEqual(decodedPayload);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(mockToken, {
        secret: 'secret'
      });
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const mockToken = 'invalid-token';
      mockJwtService.verifyAsync.mockRejectedValue(new UnauthorizedException('Invalid token'));

      await expect(service.validateToken(mockToken)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
