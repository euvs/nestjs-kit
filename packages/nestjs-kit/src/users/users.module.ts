import {Module} from '@nestjs/common';

import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {UserSchema, UserSchemaName} from '../db-models';

@Module({
    imports: [MongooseModule.forFeature([{name: UserSchemaName, schema: UserSchema}])],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {
}
