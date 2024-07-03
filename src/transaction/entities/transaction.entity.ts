import { BankAccount } from 'src/account/entities/account.entity';
import { TransactionType } from 'src/commons/enum';
import { baseEntity } from 'src/commons/utils/baseEntity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction extends baseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => BankAccount, { onDelete: 'CASCADE' })
  account: BankAccount;
  @Column({ type: 'uuid' })
  accountId: BankAccount['id'];

  @Column({ type: 'bigint', default: 0 })
  amount: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @ManyToOne(() => BankAccount, { onDelete: 'CASCADE' })
  receiverAccount: BankAccount;
  @Column({ type: 'uuid', nullable: true })
  receiverAccountId: BankAccount['id'];
}
