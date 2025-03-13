import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/users/entities/user.entity';
import { Token } from '../models/token.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(`Password incorrect, please try again`);
    }
    return user;
  }

  generateJWT(user: User) {
    const token: Token = { role: user.role, sub: user.id };
    return {
      access_token: this.jwtService.sign(token),
      user,
    };
  }
}
