import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType } from 'src/commons/enum';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BankAccount } from 'src/account/entities/account.entity';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private dataSource: DataSource,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    const bankAccount = await this.bankAccountRepository.findOneOrFail({
      where: { userId },
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if (createTransactionDto.type === TransactionType.DEPOSIT) {
        const updateBankBalance = this.bankAccountRepository
          .createQueryBuilder('banK-account', queryRunner)
          .update('bank_account')
          .set({ balance: () => `balance + ${createTransactionDto.amount}` })
          .where('userId = :id', { id: userId })
          .execute();

        const saveTransaction = queryRunner.manager.create(Transaction, {
          type: TransactionType.DEPOSIT,
          amount: createTransactionDto.amount,
          accountId: bankAccount.id,
        });
        const transaction = queryRunner.manager.save(
          Transaction,
          saveTransaction,
        );
        await Promise.all([updateBankBalance, transaction]);
        await queryRunner.commitTransaction();
        return 'successfully deposit';
      } 
      
      else if (createTransactionDto.type === TransactionType.WITHDRAW) {
        if (bankAccount.balance < createTransactionDto.amount) {
          throw new BadRequestException(
            'You dont have that amount of money in your account',
          );
        }
        const updateBankBalance = this.bankAccountRepository
          .createQueryBuilder('bank_account', queryRunner)
          .update('bank_account')
          .set({ balance: () => `balance - ${createTransactionDto.amount}` })
          .where('userId = :id', { id: userId })
          .execute();
        const saveTransaction = queryRunner.manager.create(Transaction, {
          type: TransactionType.WITHDRAW,
          amount: createTransactionDto.amount,
          accountId: bankAccount.id,
        });
        const transaction = queryRunner.manager.save(
          Transaction,
          saveTransaction,
        );
        await Promise.all([updateBankBalance, transaction]);
        await queryRunner.commitTransaction();
        return 'successfully withdrawal';
      } 
      
      else if (createTransactionDto.type === TransactionType.TRANSFER) {
        if (bankAccount.balance < createTransactionDto.amount) {
          throw new BadRequestException(
            'You dont have that amount of money in your account',
          );
        }
        const receiverAccount = await this.bankAccountRepository.findOne({
          where: { id: createTransactionDto.receiverAccountId },
        });

        if(!receiverAccount){
          throw new BadRequestException("Receive Bank account doesnt exist")
        }

        const updateBankBalance = this.bankAccountRepository
          .createQueryBuilder('bank_account', queryRunner)
          .update('bank_account')
          .set({ balance: () => `balance - ${createTransactionDto.amount}` })
          .where('userId = :id', { id: userId })
          .execute();

        const updateReceiverBankBalance = this.bankAccountRepository
          .createQueryBuilder('bank_account', queryRunner)
          .update('bank_account')
          .set({ balance: () => `balance + ${createTransactionDto.amount}` })
          .where('id = :id', { id: createTransactionDto.receiverAccountId })
          .execute();
          
        const saveTransaction = queryRunner.manager.create(Transaction, {
          type: TransactionType.TRANSFER,
          amount: createTransactionDto.amount,
          accountId: bankAccount.id,
          receiverAccountId: receiverAccount.id,
        });
        const transaction = queryRunner.manager.save(
          Transaction,
          saveTransaction,
        );
        await Promise.all([
          updateBankBalance,
          updateReceiverBankBalance,
          transaction,
        ]);
        await queryRunner.commitTransaction();
        return 'successfully transferred';
      }
    } 
    
    catch (e) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        'Something goes wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } 
    
    finally {
      await queryRunner.release();
    }
  }

  async findAll(userId: string) {
    const isAccount = await this.bankAccountRepository.findOne({where:{userId}});
    if(!isAccount){
      throw new BadRequestException('You dont have bank account')
    }
    return this.transactionRepository.find({
      where: [{ account: { userId } }, { receiverAccount: { userId } }],
      order: { createdAt: 'DESC' },
      relations: { account: { user: true }, receiverAccount: { user: true } },
      select:{id:true,createdAt:true,type:true,amount:true,account:{id:true,user:{id:true,name:true,email:true}},receiverAccount:{id:true,user:{id:true,name:true,email:true}}}
    });
  }
}
