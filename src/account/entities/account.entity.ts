import { baseEntity } from 'src/commons/utils/baseEntity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BankAccount extends baseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
  @Column({ type: 'uuid' })
  userId: User['id'];

  @Column({type:'bigint',default:0})
  balance:number
}
