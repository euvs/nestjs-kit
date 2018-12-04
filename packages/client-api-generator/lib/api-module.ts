import {INestApplication} from '@nestjs/common';

import {ApiScanner} from './api-scanner';
import {ApiSrcGenerator} from './api-src-generator';
import {IApiDefinition, IApiGeneratorBaseConfig} from './interfaces';

export class ApiModule {
    private static readonly apiScanner = new ApiScanner();
    private static readonly srcGenerator = new ApiSrcGenerator();

    public static createApiDefinition(app: INestApplication, config: IApiGeneratorBaseConfig): IApiDefinition {
        const apiDefinition = this.apiScanner.scanApplication(app);
        return {
            ...config,
            ...apiDefinition,
        };
    }

    public static generate(apiPath: string, apiDefinition: IApiDefinition) {
        const validatePath = (path): string =>
            path.charAt(0) !== '/' ? '/' + path : path;

        const finalPath = validatePath(apiPath);

        const srcString = this.srcGenerator.generateSourceCode(apiDefinition);
        return srcString;
    }
}
