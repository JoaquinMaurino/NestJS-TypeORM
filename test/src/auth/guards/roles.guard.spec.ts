import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { RolesGuard } from '../../../../src/auth/guards/roles.guard';
import { Role } from '../../../../src/auth/models/roles.enum';
import { Token } from '../../../../src/auth/models/token.interface';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  function mockExecutionContext(
    user?: Token,
    roles?: Role[],
  ): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;
  }

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if no roles are required', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);

    const context = mockExecutionContext({ role: Role.CUSTOMER, sub: 1 });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access if role is correct', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

    const context = mockExecutionContext({ role: Role.ADMIN, sub: 1 });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw an UnauthorizedException if user has no role permissions', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

    const context = mockExecutionContext({ role: Role.CUSTOMER, sub: 1 });
    expect(()=>guard.canActivate(context)).toThrow(UnauthorizedException)
  });
});
