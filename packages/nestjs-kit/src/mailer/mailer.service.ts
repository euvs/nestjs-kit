import {Inject, Injectable} from '@nestjs/common';
import {createMailAdapter, IMail, IMailerAdapter} from './adapters';

import {IMailerConfig} from './mailer.config';
import {MAILER_MODULE_CONFIG} from './mailer.constants';

@Injectable()
export class MailerService {

    public mailer: IMailerAdapter;

    constructor(@Inject(MAILER_MODULE_CONFIG) private readonly mailerConfig: IMailerConfig) {
    }

    public getMailer() {
        if (this.mailer) {
            return this.mailer;
        }

        this.mailer = createMailAdapter(this.mailerConfig);
        return this.mailer;
    }

    public sendMail = (data: IMail) => {
        return this.getMailer().sendMail(data);
    }
}
