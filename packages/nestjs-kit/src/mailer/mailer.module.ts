import {DynamicModule, Module} from '@nestjs/common';
import {MailerService} from './mailer.service';
import {IMailerConfig} from './mailer.config';
import {MAILER_MODULE_CONFIG} from './mailer.constants';

@Module({})
export class MailerModule {
    public static forRoot(config: IMailerConfig): DynamicModule {
        return {
            module: MailerModule,
            providers: [
                {provide: MAILER_MODULE_CONFIG, useValue: config},
            ],
            exports: [MAILER_MODULE_CONFIG],
            controllers: [],
        };
    }

    public static forFeature(): DynamicModule {
        return {
            module: MailerModule,
            providers: [MailerService],
            exports: [MailerService],
        };
    }
}
