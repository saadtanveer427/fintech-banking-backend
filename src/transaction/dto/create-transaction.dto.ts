import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { TransactionType } from 'src/commons/enum';

export class CreateTransactionDto {
  // bank has some limitation. you can depost , with draw or transfer minimum 100 and maximum 100000
  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  @Max(100000)
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  receiverAccountId?: string;
}
