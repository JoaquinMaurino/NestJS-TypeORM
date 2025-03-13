import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector
  ){
    super();
  }

  //Hereda la funcionalidad de JWT
  canActivate(context:ExecutionContext){
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler())
    //Si tiene el decorador Public autorizo a la ruta
    if(isPublic){
      return true
    }
    //Si no tiene Public entonces se maneja con AuthGuard('jwt')
    return super.canActivate(context);
  }
}