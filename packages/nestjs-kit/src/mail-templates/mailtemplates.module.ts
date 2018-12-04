import {Module} from '@nestjs/common';

import {MailTemplatesService} from './mailtemplates.service';
import {MailTemplatesController} from './mailtemplates.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {MailTemplateSchema, MailTemplateSchemaName} from '../db-models';

@Module({
    imports: [MongooseModule.forFeature([{name: MailTemplateSchemaName, schema: MailTemplateSchema}])],
    controllers: [MailTemplatesController],
    providers: [MailTemplatesService],
    exports: [MailTemplatesService],
})
export class MailTemplatesModule {
}
