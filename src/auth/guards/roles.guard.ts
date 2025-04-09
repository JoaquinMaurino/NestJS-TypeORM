import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Token } from '../models/token.interface';
import { endWith, Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Extrae los roles requeridos definids con el decorador @RolesGuard
    // Busca primero en el metodo handler, luego en la clase (controller)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [
        context.getHandler(), //Metoodo especifico del controlador
        context.getClass(), //Clase del controlador
      ],
    );

    //Si no se definieron role se permite el acceso
    if (!requiredRoles) return true;

    //Obtener el objeto de request del contexto HTTP
    const request = context.switchToHttp().getRequest();

    //Validacion: Tipa el usuario que fue agregado al request por el JwtAuthGuard
    const user: Token = request.user;

    //Si no hay usuario o el rol del usuario no esta entre los permitidos
    const isAuthorized = requiredRoles.includes(user?.role);
    if (!user || !isAuthorized)
      throw new ForbiddenException(
        'User does not posses the required permissions',
      );

    //Si pasa todas las validaciones
    return true;
  }
}
