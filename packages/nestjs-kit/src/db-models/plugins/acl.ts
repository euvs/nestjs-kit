import {Document, Model, Schema} from 'mongoose';
import * as mongoose from 'mongoose';
import {IUser} from '../user';

export interface IAclPlugin<T> {
    setAcl: (user: IUser) => mongoose.DocumentQuery<T[] | T, any>;
}

export interface IModelWithAclPlugin<T extends Document> extends Model<T>, IAclPlugin<T> {}

export const ACLPlugin = (schema: Schema) => {

    function setAcl<T>(user: IUser): mongoose.Query<T[] | T> {
        if (user.role === 'admin') {
            return this.where({});
        }
        return this.where({owner: user.id});
    }

    schema.query.setAcl = setAcl;
    schema.statics.setAcl = setAcl;
};
