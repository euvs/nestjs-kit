import {mapValues, reduce} from 'lodash';
import {IApiDefinition} from './interfaces';

interface IParameterType {
    in: string;
    name: string;
    required: boolean;
    type: any;
    typeString: string;
    index: number;
}

interface IServiceAction {
    method: string;
    parameters?: IParameterType[];
    pathParameters?: IParameterType[];
    bodyParameters?: IParameterType[];
    path: string;
    serviceMethod: string;
    serviceName: string;
}

export class ApiSrcGenerator {
    public mapTypeToString = (type) => {
        if (type === Object || type === 'Object' || type === 'object') {
            return 'any';
        }
        if (type === String) {
            return 'string';
        }
        if (type === Boolean) {
            return 'boolean';
        }
        return type;
    }

    private mapAction = (action: IServiceAction) => {
        const parameters = action.parameters || [];

        const pathParams = parameters
            .filter((p) => {
                return p.in === 'path';
            })
            .sort((p1, p2) => (p1.index < p2.index ? -1 : 1))
            .map((p) => {
                const typeString = this.mapTypeToString(p.type);
                return {...p, typeString};
            });

        const bodyParams = parameters
            .filter((p) => {
                return p.in === 'body';
            })
            .map((p) => {
                const typeString = this.mapTypeToString(p.type);
                return {...p, name: 'data', typeString: typeString};
            });

        return {
            ...action,
            pathParameters: pathParams,
            bodyParameters: bodyParams,
        };
    }

    private prepareServices = (services: any[]) => {
        return mapValues(services, (service) => {
            return mapValues(service, this.mapAction);
        });
    }

    public generateServiceActionInterface = (action: IServiceAction) => {
        const params = [];
        if (action.pathParameters.length > 0) {
            const def = action.pathParameters.map((p) => {
                return `${p.name}: ${p.typeString}`;
            });
            params.push(...def);
        }

        if (action.bodyParameters.length > 0) {
            const defs = action.bodyParameters.map((p) => {
                return `${p.name}: ${p.typeString}`;
            });
            params.push(...defs);
        }

        const interfaceString = `${action.serviceMethod}: (${params.join(', ')}) => Promise<any>;`;
        return interfaceString;
    }

    public generateServiceInterfaces = (serviceSrc) => {
        return reduce(
            serviceSrc,
            (rootAcc, service, key) => {
                rootAcc += `export interface I${key} {\n`;

                const serviceString = reduce(
                    service,
                    (serviceAcc, serviceAction) => {
                        const servicActionInterface = this.generateServiceActionInterface(
                            serviceAction,
                        );
                        serviceAcc += `    ${servicActionInterface}\n`;
                        return serviceAcc;
                    },
                    '',
                );

                rootAcc += serviceString;

                rootAcc += `}\n\n`;

                return rootAcc;
            },
            '',
        );
    }

    private prepareDefinitions = (definitions: any[]) => {
        return definitions;
    }

    private generateDefinitionPropertyString = (name, propertyConf, isRequired = false) => {
        const {type, description} = propertyConf;
        let str = '';
        if (description) {
            str += `    // ${description}\n`;
        }
        str += `    ${name}${isRequired ? '' : '?'}: ${this.mapTypeToString(
            type,
        )};\n`;
        return str;
    }

    public generateDefinitionInterfaces = (definitions) => {
        return reduce(definitions, (rootAcc, definition, key) => {
            if (key === 'Object') {
                return rootAcc;
            }

            rootAcc += `export interface ${key} {\n`;

            const serviceString = reduce(definition.properties, (definitionAcc, value, serviceName) => {
                const isRequired = (definition.required || []).some((e) => e === serviceName);
                definitionAcc += this.generateDefinitionPropertyString(serviceName, value, isRequired);
                return definitionAcc;
            }, '');

            rootAcc += serviceString;

            rootAcc += `}\n\n`;

            return rootAcc;
        }, '');
    }

    public generateSourceCode = (document: IApiDefinition): string => {
        const services = this.prepareServices(document.paths);
        const definitions = this.prepareDefinitions(document.definitions);
        const servicesSrc = this.generateServiceInterfaces(services);
        const definitionsSrc = this.generateDefinitionInterfaces(definitions);
        return definitionsSrc + '\n' + servicesSrc;
    }
}
