
import {NestMiddleware, MiddlewareFunction, Injectable} from '@nestjs/common';
const morgan = require('morgan');

const mt = morgan('tiny', {
    // skip: function (req, res) { return res.statusCode === 304 }
});

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    public resolve(name: string): MiddlewareFunction {
        return mt;
    }
};