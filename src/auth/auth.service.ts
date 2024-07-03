import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { SignInDto } from './dto/sign-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { JWT_SECRET } from 'src/commons/enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createAuthDto: CreateAuthDto) {
    createAuthDto.password = await bcrypt.hash(createAuthDto.password, 10);
    const saveUser = this.userRepository.create(createAuthDto);
    const user = await this.userRepository.save(saveUser);
    // i didnt use envs as it is test project
    let token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: '90d',
    });

    delete user.password;
    return { token, user };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userRepository.findOneOrFail({
      where: { email: signInDto.email, password: signInDto.password },
    });

    let token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: '90d',
    });
    return { token, user };
  }
}
