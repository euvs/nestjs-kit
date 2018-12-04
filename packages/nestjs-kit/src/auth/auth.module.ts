import {DynamicModule, Module, Provider} from '@nestjs/common';

import {AuthService} from './auth.service';
import {JwtStrategy} from './passport/jwt.strategy';
import {UsersModule} from '../users';
import {UsersService} from '../users';

import {AuthController} from './auth.controller';
import {IAuthConfig} from './auth.config';
import {AUTH_MODULE_CONFIG} from './auth.constants';

@Module({})
export class AuthModule {
    public static forRoot(
        config: IAuthConfig,
        notificationProvider: Provider,
    ): DynamicModule {
        return {
            module: AuthModule,
            providers: [
                {provide: AUTH_MODULE_CONFIG, useValue: config},
                notificationProvider,
            ],
            exports: [AUTH_MODULE_CONFIG, notificationProvider],
        };
    }

    public static forFeature(): DynamicModule {
        return {
            module: AuthModule,
            imports: [
                UsersModule,
            ],
            providers: [
                AuthService,
                UsersService,
                JwtStrategy,
            ],
            controllers: [AuthController],
            exports: [AuthService, AuthModule],
        };
    }
}
