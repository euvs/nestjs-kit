import {groupBy, keyBy, filter, mapValues, omit} from 'lodash';

export class ApiTransformer {

    public normalizePaths(denormalizedDoc) {
        const doc = filter<any>(denormalizedDoc, (r) => r.root);

        const groupedByPath = groupBy(doc, ({root}) => root.serviceName);

        const paths = mapValues(groupedByPath, (routes) => {
            const keyByMethod = keyBy(routes, ({root}) => root.serviceMethod);
            return mapValues(keyByMethod, (route: any) => {
                return route.root;
                // return {
                //   ...omit(route.root, ['method', 'path']),
                //   ...omit(route, 'root'),
                // };
            });
        });
        return {
            paths,
        };
    }
}
