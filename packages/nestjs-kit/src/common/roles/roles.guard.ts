import {Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException} from '@nestjs/common';
import {Reflector} from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private readonly reflector: Reflector) {
    }

    public canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new ForbiddenException();
        }

        const hasRole = () => {
            return roles.includes(user.role);
        };
        return user && user.role && hasRole();
    }
}
