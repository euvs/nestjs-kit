import {AUTH_MODULE_CONFIG} from '../auth.constants';

const passport = require('passport');
import {ExtractJwt, Strategy} from 'passport-jwt';
import {UnauthorizedException, Injectable, Inject} from '@nestjs/common';
import {AuthService} from '../auth.service';
import {IAuthConfig} from '../auth.config';

@Injectable()
export class JwtStrategy {

    private readonly jwtStrategy;

    constructor(
        private readonly authService: AuthService,
        @Inject(AUTH_MODULE_CONFIG) private readonly authConfig: IAuthConfig,
    ) {

        this.jwtStrategy = new Strategy({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                passReqToCallback: true,
                secretOrKey: this.authConfig.secret,
            },
            async (req, payload, next) => await this.verify(req, payload, next),
        );

        passport.use(this.jwtStrategy);
    }

    public async verify(req, payload, done) {
        const user = await this.authService.validateUser(payload);
        if (!user) {
            return done(new UnauthorizedException(), false);
        }
        req.user = user;
        done(null, payload);
    }
}
