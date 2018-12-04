import {MODULE_PATH} from '@nestjs/common/constants';
import {extend, flatten, isEmpty, map, reduce} from 'lodash';
import {ApiExplorer} from './api-explorer';
import {ApiTransformer} from './api-transformer';
import {IApiDefinition} from './interfaces';

export class ApiScanner {
    private readonly explorer = new ApiExplorer();
    private readonly transfomer = new ApiTransformer();

    public scanApplication(app, includedModules?: Function[]): IApiDefinition {
        const {container} = app;
        const modules = this.getModules(container.getModules(), includedModules);
        const denormalizedPaths = map(modules, ({routes, metatype}) => {
            // Note: nest-router
            // Get the module path (if any), to prefix it for all the module controllers.
            const path = metatype
                ? Reflect.getMetadata(MODULE_PATH, metatype)
                : undefined;
            return this.scanModuleRoutes(routes, path);
        });

        return {
            ...this.transfomer.normalizePaths(flatten(denormalizedPaths)),
            definitions: reduce(this.explorer.getModelsDefinitons(), extend),
        };
    }

    public scanModuleRoutes(routes, modulePath): IApiDefinition {
        const denormalizedArray = [...routes.values()].map((ctrl) =>
            this.explorer.exploreController(ctrl, modulePath),
        );
        return flatten(denormalizedArray) as any;
    }

    public getModules(modulesContainer: Map<any, any>, include: Function[]): any[] {
        if (!include || isEmpty(include)) {
            return [...modulesContainer.values()];
        }
        return [...modulesContainer.values()].filter(({metatype}) =>
            include.some((item) => item === metatype),
        );
    }
}
