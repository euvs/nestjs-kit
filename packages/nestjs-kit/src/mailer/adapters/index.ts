import DevMailAdapter from './mail-adapter-dev';
import SendgridMailAdapter from './mail-adapter-sendgrid';
import {IMailerConfig, MailerProvider} from '../mailer.config';

export const createMailAdapter = (mailerConfig: IMailerConfig) => {
    switch (mailerConfig.provider) {
        case MailerProvider.sendgrid :
            return new SendgridMailAdapter({
                apiKey: mailerConfig.sendgrid.apiKey,
                fromAddress: mailerConfig.fromAddress,
            });
        case MailerProvider.dev:
            return new DevMailAdapter({
                fromAddress: mailerConfig.fromAddress,
            });
        default:
            throw new Error('Unknown mailer provider ' + mailerConfig.provider);
    }
};

export * from './mail-adapter-interface';