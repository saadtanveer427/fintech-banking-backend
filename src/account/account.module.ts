import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { BankAccount } from './entities/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports:[TypeOrmModule.forFeature([BankAccount])],

})
export class AccountModule {}
