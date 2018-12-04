const sgMail = require('@sendgrid/mail');
import {IMail, IMailerAdapter} from './mail-adapter-interface';

export interface ISendgridConfig {
    apiKey: string;
    fromAddress: string;
}

export default class SendgridAdapter implements IMailerAdapter {

    public fromAddress: string;

    constructor(sendgridOptions: ISendgridConfig) {
        if (!sendgridOptions || !sendgridOptions.apiKey || !sendgridOptions.fromAddress) {
            throw new Error('SendgridAdapter requires an API Key and fromAddress.');
        }

        sgMail.setApiKey(sendgridOptions.apiKey);

        this.fromAddress = sendgridOptions.fromAddress;
    }

    public async sendMail(mail: IMail): Promise<any> {

        if (process.env.MAILER_FORCE_ALL_EMAILS_TO_ADDRESS) {
            mail.to = process.env.MAILER_FORCE_ALL_EMAILS_TO_ADDRESS;
        }

        const data = {
            to: mail.to,
            from: mail.from || this.fromAddress,
            subject: mail.subject,
            text: mail.text,
            html: mail.html,
        };
        return sgMail.send(data);
    }
}
