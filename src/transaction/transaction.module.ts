import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { BankAccount } from 'src/account/entities/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [TypeOrmModule.forFeature([BankAccount, Transaction])],
})
export class TransactionModule {}
