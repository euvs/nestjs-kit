import {HttpException, HttpStatus} from '@nestjs/common';
import * as passport from 'passport';

export const JWTAuthMiddleware = (req, res, next) => {
    passport.authenticate('jwt', (err, user, info) => {
        if (err) {
            next(err);
            return;
        }
        if (!user) {
            next(new HttpException(info ? info.message : "", HttpStatus.UNAUTHORIZED));
            return;
        }
        next();
    })(req, res, next);
};
