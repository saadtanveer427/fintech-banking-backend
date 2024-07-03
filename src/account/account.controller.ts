import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from 'src/commons/auth.guard';

@UseGuards(AuthGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}


  // create bank account
  @Post()
  create(@Req() req) {
    const userId = req.user.id;
    return this.accountService.create(userId);
  }

  //view Balance of your account
  @Get()
  viewBalance(@Req() req) {
    const userId = req.user.id;
    return this.accountService.viewBalance(userId);
  }

}
