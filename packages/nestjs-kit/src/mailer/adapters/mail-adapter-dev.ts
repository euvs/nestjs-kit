import {IMail, IMailerAdapter} from './mail-adapter-interface';

export interface IDevMailerConfig {
    fromAddress: string;
}

class DevMailAdapter implements IMailerAdapter {

    public fromAddress: string;
    public mailHistory;
    public randomId;

    constructor(options: IDevMailerConfig) {
        this.randomId = Math.ceil(Math.random() * 10000);
        this.fromAddress = options.fromAddress || 'test@mail.com';
        this.mailHistory = [];
    }

    public async sendMail(mail: IMail) {
        const data = {
            from: this.fromAddress,
            type: 'sendMail',
            ...mail,
        };

        console.log(`[Dev mailer ${this.randomId}]: send mail:`, data);
        this.mailHistory.push(data);

        return data;
    }

    public resetHistory() {
        this.mailHistory = [];
    }

    public lastMail() {
        if (this.mailHistory.length === 0) {
            return null;
        }
        return this.mailHistory[this.mailHistory.length - 1];
    }
}

export default DevMailAdapter;
