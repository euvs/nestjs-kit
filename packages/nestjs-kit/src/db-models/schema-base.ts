import {Document, Schema, Types} from 'mongoose';
import {IUser, UserSchemaName} from './user';

export namespace ModelType {

    export type ID = Types.ObjectId | string;

    export const isId = (data: any): data is ModelType.ID => {
        return data.constructor.name === 'ObjectID' || typeof data === 'string';
    };

    export const extractId = (data: ModelOrId<any>): ID => {
        return ModelType.isId(data) ? data : data.id;
    };

    export interface IModel {
        id?: ID;
    }

    export type AnyModel = IModel & { [key: string]: any };
}

export type ModelOrId<T extends ModelType.IModel> = T | ModelType.ID;

export const getOwnedModelSchemaBase = () => ({
    owner: {
        type: Schema.Types.ObjectId,
        ref: UserSchemaName,
    },
});

export interface IBaseDocument extends Document {
    id?: ModelType.ID;
}

export interface IEntityDocument extends IBaseDocument {
    role: string;
}

export interface IOwnedModelDocument extends IBaseDocument {
    owner: ModelOrId<IUser>;
}
