import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(userObject: RegisterDto) {
    //Toma password del objeto userObject y si role viene undefined se asigna user automaticamente
    const { password, role = 'user' } = userObject;
    //Valido que passworde existe para luego poder encriptarla
    if (!password) throw new Error('Password is required');

    const hashedPassword = await bcrypt.hash(password, 10);

    //Crear usuario con la password encriptada
    const newUser = await this.userService.createOne({
      ...userObject,
      password: hashedPassword,
      role,
    });
    const access_token = this.jwtService.sign({
      sub: newUser.id,
      role: newUser.role,
    });
    return {
      user: newUser,
      access_token,
    };
  }

  async login(userLogin: LoginDto) {
    //Tomamos email y password del objeto enviado por body
    const { email, password } = userLogin;
    //Buscamos al user en la DB
    const user = await this.userService.findByEmail(email);
    //Comparamos password ingresada con la encriptada de la DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      throw new UnauthorizedException(`Password incorrect, please try again`);

    const access_token = this.jwtService.sign({
      sub: user.id,
      role: user.role,
    });
    return { user, access_token };
  }
}
