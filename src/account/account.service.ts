import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { BankAccount } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccounntRepository: Repository<BankAccount>,
  ) {}
  
  
  async create(userId: string) {
    const account = await this.bankAccounntRepository.findOne({
      where: { userId },
    });
    if (account) {
      throw new BadRequestException('You already have a bank Account');
    }
    const saveAccount = this.bankAccounntRepository.create({ userId });
    return this.bankAccounntRepository.save(saveAccount);
  }


  async viewBalance(userId: string) {
    const account = await this.bankAccounntRepository.findOne({
      where: { userId },select:{balance:true}
    });
    if (!account) {
      throw new BadRequestException('You dont have a bank Account');
    }
    return {balance:account.balance};
  }
}
