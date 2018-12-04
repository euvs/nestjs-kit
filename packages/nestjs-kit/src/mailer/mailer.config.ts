export enum MailerProvider {
    sendgrid = 'sendgrid',
    dev = 'dev',
}

interface IMailerProviderConfig {
    type: MailerProvider;
    [key: string]: any;
}

const sendgridConfig: IMailerProviderConfig = {
    type: MailerProvider.sendgrid,
    apiKey: process.env.MAILER_API_KEY || 'mailer key',
};

const devConfig: IMailerProviderConfig = {
    type: MailerProvider.dev,
};

export interface IMailerConfig {
    fromAddress: string;
    provider: MailerProvider;
    dev: IMailerProviderConfig;
    sendgrid: IMailerProviderConfig;
}

export const defaultMailerConfig: IMailerConfig = {
    fromAddress: (process.env.MAILER_FROM_ADDRESS as string) || 'no-reply@example.com',
    provider: process.env.MAILER_PROVIDER === 'sendgrid' ? MailerProvider.sendgrid : MailerProvider.dev,
    sendgrid: sendgridConfig,
    dev: devConfig,
};
