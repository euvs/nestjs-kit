import {createParamDecorator, UnauthorizedException} from '@nestjs/common';

export const User = createParamDecorator((data, req) => {
    // if (!req.user) {
    //     throw new UnauthorizedException();
    // }
    return req.user;
});
