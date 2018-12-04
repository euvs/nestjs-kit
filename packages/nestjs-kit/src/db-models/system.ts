import {Schema, Document, Model, model} from 'mongoose';

export const SystemSchemaName = 'System';

export interface ISystemModel extends Document {
    mongo: any;
    redis: any;
    host: any;
    auth: any;
    storage: any;
    pagination: any;
    mailer: any;
    env: any;
}

export const SystemSchema = new Schema({
    mongo: Schema.Types.Mixed,
    redis: Schema.Types.Mixed,
    host: Schema.Types.Mixed,
    auth: Schema.Types.Mixed,
    storage: Schema.Types.Mixed,
    pagination: Schema.Types.Mixed,
    mailer: Schema.Types.Mixed,
    env: Schema.Types.Mixed,
}, {
    toJSON: {
        transform: (doc, ret, options) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});

export const SystemModel: Model<ISystemModel> = model(SystemSchemaName, SystemSchema);
