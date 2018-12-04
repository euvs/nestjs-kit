export interface IMail {
    from?: string;
    to: string;
    subject: string;
    text?: string;
    html: string;
    type?: string;
    metadata?: any;
}

export interface IMailerAdapter {
    sendMail(mail: IMail): Promise<any>;
}
