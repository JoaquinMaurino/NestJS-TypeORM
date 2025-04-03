import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { UsersModule } from '../users/users.module';

import config from '../../config';

@Module({
  imports: [
    UsersModule,
      JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwtSecret,
          signOptions: {
            expiresIn: '10d',
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtAuthGuard],
  controllers: [AuthController,],
  exports: [AuthService, JwtModule, JwtAuthGuard]
})
export class AuthModule {}
