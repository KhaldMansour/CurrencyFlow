import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { CurrenciesModule } from 'src/currencies/currencies.module';

import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User, UserSchema } from './entities/user.entity';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CurrenciesModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [MongooseModule, UsersService]
})
export class UsersModule {}
