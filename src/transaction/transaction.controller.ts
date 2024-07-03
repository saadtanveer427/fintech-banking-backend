import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { BankAccount } from 'src/account/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthGuard } from 'src/commons/auth.guard';

@UseGuards(AuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>,
  ) {}


  //withdraw, deposit or transfer money api
  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto, @Req() req) {
    const userId = req.user.id;
    return this.transactionService.create(createTransactionDto, userId);
  }

  //view transaction history api
  @Get()
  findAll(@Req() req) {
    const userId = req.user.id;
    return this.transactionService.findAll(userId);
  }

  
}
