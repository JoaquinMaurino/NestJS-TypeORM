import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { AuthController } from '../../../../src/auth/controllers/auth.controller';
import { AuthService } from '../../../../src/auth/services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  //Mockeamos AuthGuard para ue siempre retorne true y no bloquee
  class MockAuthGuard {
    canActivate(context: ExecutionContext) {
      return true;
    }
  }

  const mockService = {
    generateJWT: jest.fn().mockReturnValue('jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(AuthGuard('local')) //Sobreescribimos el guard para evitar la autenticacion real
      .useClass(MockAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a JWT token when login', async () => {
    const mockUser = {
      id: 1,
      email: 'user@gmail.com',
      password: '123',
    };
    const mockRequest = { user: mockUser } as unknown as Request;
    const result = await controller.login(mockRequest);
    expect(result).toBe('jwt-token')
  });
});
