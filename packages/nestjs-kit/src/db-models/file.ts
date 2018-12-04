import {updateTimePlugin, ACLPlugin, IAclPlugin} from './plugins';
import {getOwnedModelSchemaBase, IOwnedModelDocument} from './schema-base';
import {Model} from 'mongoose';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

export const FileSchemaName = 'File';

export interface IFile extends IOwnedModelDocument {
    filename: string;
    seqNumber: number;
    mimetype: string;
    originalname: string;
    size: number;
    path: string;
    url: string;
    owner: any;
    metadata: any;
}

export const FileSchema = new Schema({
    ...getOwnedModelSchemaBase(),
    filename: String,
    seqNumber: Number,
    mimetype: String,
    originalname: String,
    path: String,
    size: Number,
    url: String,
    metadata: Schema.Types.Mixed,
});

FileSchema.pre('remove', (next) => {
    console.log('TODO: delete file');
    next();
});

FileSchema.options.toJSON = {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret.path;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
};

FileSchema.plugin(updateTimePlugin);
FileSchema.plugin(ACLPlugin);

type M = Model<IFile>;
export type FileModelType = M & IAclPlugin<IFile>;
export default mongoose.model(FileSchemaName, FileSchema) as FileModelType;
