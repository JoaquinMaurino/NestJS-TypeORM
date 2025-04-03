import { Reflector } from '@nestjs/core';
import { ExecutionContext,UnauthorizedException } from '@nestjs/common';

import { ApiKeyGuard } from '../../../../src/auth/guards/api-key.guard';

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;
  let reflector: Reflector;
  let configServiceMokc: { apiKey: string };

  beforeEach(() => {
    reflector = new Reflector();
    configServiceMokc = { apiKey: 'API_KEY' };
    guard = new ApiKeyGuard(reflector, configServiceMokc as any);
  });

  function mockExecutionContext(authHeader?: string): ExecutionContext {
    const request = {
      header: jest.fn((name: string) =>
        name === 'Auth' ? authHeader : undefined,
      ),
    };
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;
  }
  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if rute is public', ()=>{
    jest.spyOn(reflector, 'get').mockReturnValue(true);
    const context = mockExecutionContext();
    expect(guard.canActivate(context)).toBe(true)
  })


  describe('API_KEY authorization', ()=>{
    it('should allow access if API key is correct', ()=>{
      jest.spyOn(reflector, 'get').mockReturnValue(false)
      const context = mockExecutionContext('API_KEY')
      expect(guard.canActivate(context)).toBe(true)
    })
    it('should throw UnauthorizedException if API key is incorrect', ()=>{
      jest.spyOn(reflector, 'get').mockReturnValue(false)
      const context = mockExecutionContext('WRONG_KEY')
      expect(()=> guard.canActivate(context)).toThrow(UnauthorizedException)
    })
  })

});
