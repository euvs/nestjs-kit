import * as mongoose from 'mongoose';
import {PaginationOptions} from '../common';

export const findAllWithRestQuery = <T>(r: mongoose.DocumentQuery<T[] | T, any>,
                                        pagination?: PaginationOptions,
                                        filter?: any): mongoose.DocumentQuery<T[] | T, any> => {
    if (filter) {
        r = r.where(filter);
    }
    if (pagination) {
        const skip = pagination.pageIndex * pagination.pageSize;
        r = r.limit(pagination.pageSize).skip(skip);
    }
    r = r.sort({createdAt: -1});
    return r;
};
