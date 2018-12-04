import {Document, Model, Schema} from 'mongoose';
import * as mongoose from 'mongoose';
import {PaginationOptions} from '../../common/pagination.decorator';

export interface IRestQueryPlugin<T> {
    findAllWithRestQuery: (pagination?: PaginationOptions, filter?: any) => mongoose.DocumentQuery<T[] | T, any>;
}

export interface IModelWithRestQueryPlugin<T extends Document> extends Model<T>, IRestQueryPlugin<T> {
}

export const RestQueryPlugin = (schema: Schema) => {

    function findAllWithRestQuery<T>(pagination?: PaginationOptions, filter?: any): mongoose.Query<T[] | T>  {
        let r = this;
        if (filter) {
            r = r.where(filter);
        }
        if (pagination) {
            const skip = pagination.pageIndex * pagination.pageSize;
            r = r.limit(pagination.pageSize).skip(skip);
        }
        r = r.sort({createdAt: -1}).populate(this.jobPopulateFields);
        return r;
    }

    schema.query.findAllWithRestQuery = findAllWithRestQuery;
    schema.statics.findAllWithRestQuery = findAllWithRestQuery;
};
