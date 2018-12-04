import {updateTimePlugin, ACLPlugin, IAclPlugin} from './plugins';
import {getOwnedModelSchemaBase, IOwnedModelDocument} from './schema-base';
import {Model} from 'mongoose';

import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const MailTemplateSchemaName = 'MailTemplate';

export interface IMailTemplate extends IOwnedModelDocument {
    name: string;
    template: string;
    actionType: string;
    metadata: any;
}

export const MailTemplateSchema = new Schema({
    ...getOwnedModelSchemaBase(),
    name: String,
    actionType: String,
    template: Schema.Types.String,
    metadata: Schema.Types.Mixed,
});

MailTemplateSchema.set('toJSON', {
    transform: (doc, ret: IMailTemplate, options) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

MailTemplateSchema.plugin(updateTimePlugin);
MailTemplateSchema.plugin(ACLPlugin);

type M = Model<IMailTemplate>;
export type MailTemplateModelType = M & IAclPlugin<IMailTemplate>;
export default mongoose.model<IMailTemplate>(MailTemplateSchemaName, MailTemplateSchema) as MailTemplateModelType;
