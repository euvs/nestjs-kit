import {IApiGeneratorBaseConfig} from './interfaces';

import {documentBase} from './fixtures/document.base';

export class ApiDefinitionBuilder {

    private readonly document: IApiGeneratorBaseConfig = documentBase;

    public setTitle(title: string): this {
        this.document.info.title = title;
        return this;
    }

    public setDescription(description: string): this {
        this.document.info.description = description;
        return this;
    }

    public setVersion(version: string): this {
        this.document.info.version = version;
        return this;
    }

    public setBasePath(basePath: string): this {
        this.document.basePath = basePath.startsWith('/')
            ? basePath
            : '/' + basePath;
        return this;
    }

    public setHost(host: string): this {
        this.document.host = host;
        return this;
    }

    // TODO: add authentication methods.
    // public addBearerAuth(
    //     name: string = 'Authorization',
    //     location: 'header' | 'body' | 'query' = 'header',
    //     type: string = 'apiKey'
    // ): this {
    //     this.document.securityDefinitions = {
    //         ...(this.document.securityDefinitions || {}),
    //         bearer: {
    //             type,
    //             name,
    //             in: location
    //         }
    //     };
    //     return this;
    // }
    //
    // public addOAuth2(
    //     flow: 'implicit' | 'password' | 'application' | 'accessCode' = 'password',
    //     authorizationUrl?: string,
    //     tokenUrl?: string,
    //     scopes?: object
    // ): this {
    //     this.document.securityDefinitions = {
    //         ...(this.document.securityDefinitions || {}),
    //         oauth2: {
    //             type: 'oauth2',
    //             flow,
    //             authorizationUrl,
    //             tokenUrl,
    //             scopes
    //         }
    //     };
    //     return this;
    // }

    public build(): IApiGeneratorBaseConfig {
        return this.document;
    }
}
