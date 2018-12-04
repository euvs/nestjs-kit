
export interface IApiGeneratorBaseConfig {
    basePath?: string;
    host?: string;
    info?: {
        description?: string,
        title?: string,
        version?: string,
    };
}

export interface IApiDefinition extends IApiGeneratorBaseConfig {
    paths?: any;
    definitions?: any;
}
