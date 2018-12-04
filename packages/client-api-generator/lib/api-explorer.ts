import {RequestMethod} from '@nestjs/common';
import * as consts from '@nestjs/common/constants';
import {Controller} from '@nestjs/common/interfaces';
import {isString, isUndefined, validatePath} from '@nestjs/common/utils/shared.utils';
import {InstanceWrapper} from '@nestjs/core/injector/container';
import {MetadataScanner} from '@nestjs/core/metadata-scanner';
import {isArray, mapValues} from 'lodash';
import * as pathToRegexp from 'path-to-regexp';
import {exploreApiParametersMetadata} from './explorers/api-parameters.explorer';

export class ApiExplorer {
    private readonly metadataScanner = new MetadataScanner();
    private readonly modelsDefinitions = [];

    public exploreController({instance, metatype}: InstanceWrapper<Controller>, modulePath: string) {
        const prototype = Object.getPrototypeOf(instance);
        const explorersSchema = {
            root: [
                this.exploreRoutePathAndMethod,
                exploreApiParametersMetadata.bind(null, this.modelsDefinitions),
            ],
            // responses: [exploreApiResponseMetadata.bind(null, this.modelsDefinitions)]
        };
        return this.generateDenormalizedDocument(
            metatype,
            prototype,
            instance,
            explorersSchema,
            modulePath,
        );
    }

    public getModelsDefinitons() {
        return this.modelsDefinitions;
    }

    private generateDenormalizedDocument(
        metatype,
        prototype,
        instance,
        explorersSchema,
        modulePath,
    ) {
        let path = this.validateRoutePath(this.reflectControllerPath(metatype));
        if (modulePath) {
            path = modulePath + path;
        }
        const self = this;
        const denormalizedPaths = this.metadataScanner.scanFromPrototype(
            instance,
            prototype,
            (name) => {
                const targetCallback = prototype[name];
                const methodMetadata = mapValues(explorersSchema, (explorers: any[]) =>
                    explorers.reduce((metadata, fn) => {
                        const exploredMetadata = fn.call(
                            self,
                            instance,
                            prototype,
                            targetCallback,
                            path,
                        );
                        if (!exploredMetadata) {
                            return metadata;
                        }
                        if (!isArray(exploredMetadata)) {
                            return {...metadata, ...exploredMetadata};
                        }
                        return isArray(metadata)
                            ? [...metadata, ...exploredMetadata]
                            : exploredMetadata;
                    }, {}),
                );
                return methodMetadata;
            },
        );
        return denormalizedPaths;
    }

    private exploreRoutePathAndMethod(instance, prototype, method, globalPath) {
        const routePath = Reflect.getMetadata(consts.PATH_METADATA, method);
        if (isUndefined(routePath)) {
            return undefined;
        }
        const requestMethod = Reflect.getMetadata(
            consts.METHOD_METADATA,
            method,
        ) as RequestMethod;
        const fullPath = globalPath + this.validateRoutePath(routePath);
        return {
            method: RequestMethod[requestMethod].toLowerCase(),
            path: fullPath === '' ? '/' : fullPath,
            serviceName: prototype.constructor.name,
            serviceMethod: method.name,
        };
    }

    private reflectControllerPath(metatype): string {
        return Reflect.getMetadata(consts.PATH_METADATA, metatype);
    }

    private validateRoutePath(path: string): string {
        if (isUndefined(path)) {
            return '';
        }
        let pathWithParams = '';
        for (const item of pathToRegexp.parse(path)) {
            if (isString(item)) {
                pathWithParams += item;
            } else {
                pathWithParams += `${item.prefix}{${item.name}}`;
            }
        }
        return pathWithParams === '/' ? '' : validatePath(pathWithParams);
    }
}
