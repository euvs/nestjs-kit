const Mailgun = require('mailgun-js');
import {IMail, IMailerAdapter} from './mail-adapter-interface';

export default class MailgunAdapter implements IMailerAdapter {

    public mailgun = null;
    public fromAddress: string;

    constructor(mailgunOptions) {
        if (!mailgunOptions || !mailgunOptions.apiKey || !mailgunOptions.domain || !mailgunOptions.fromAddress) {
            throw new Error('SimpleMailgunAdapter requires an API Key, domain, and fromAddress.');
        }

        this.mailgun = Mailgun({
            apiKey: mailgunOptions.apiKey,
            domain: mailgunOptions.domain,
        });

        this.fromAddress = mailgunOptions.fromAddress;
    }

    public sendMail(mail: IMail) {

        if (process.env.MAILER_FORCE_ALL_EMAILS_TO_ADDRESS) {
            mail.to = process.env.MAILER_FORCE_ALL_EMAILS_TO_ADDRESS;
        }

        const data = {
            from: mail.from || this.fromAddress,
            to: mail.to,
            subject: mail.subject,
            text: mail.text,
            html: mail.html,
        };

        return this.mailgun.messages().send(data);
    }
}
