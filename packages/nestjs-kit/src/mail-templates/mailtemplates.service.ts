import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {IMailTemplate, IUser, MailTemplateModelType, MailTemplateSchemaName} from '../db-models';
import {PaginationOptions} from '../common';
import {findAllWithRestQuery} from '../db-models';
import {ModelType} from '../db-models';
import {CreateDto} from './dto';
import * as Handlebars from 'handlebars';

@Injectable()
export class MailTemplatesService {

    constructor(@InjectModel(MailTemplateSchemaName) private readonly mailTemplateModel: MailTemplateModelType) {
    }

    public async countAll(viewer: IUser) {
        return this.mailTemplateModel.setAcl(viewer).estimatedDocumentCount().exec();
    }

    public async listAll(viewer: IUser, pagination: PaginationOptions, filters?: any) {
        let r = this.mailTemplateModel.setAcl(viewer).find({});
        r = findAllWithRestQuery(r, pagination, filters);
        // r = r.populate(this.populateFields);

        try {
            return await r.exec();
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }

    public async create(viewer: IUser, input: CreateDto) {
        let newModel = new this.mailTemplateModel(input);
        try {
            newModel = await newModel.save();
            return newModel;
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }

    public async update(viewer: IUser, id: ModelType.ID, data: Partial<IMailTemplate>): Promise<IMailTemplate> {
        const template = await this.mailTemplateModel.setAcl(viewer).findOneAndUpdate({_id: id}, data, {new: true});
        if (!template) {
            throw new NotFoundException();
        }

        return template;
    }

    public async findById(viewer: IUser, id: ModelType.ID): Promise<IMailTemplate> {
        if (!id) {
            throw new NotFoundException();
        }

        try {
            return await this.mailTemplateModel.findById(id);
        } catch (e) {
            throw new NotFoundException();
        }
    }

    public async findByActionType(actionType: string): Promise<IMailTemplate> {
        if (!actionType) {
            return null;
        }

        try {
            return await this.mailTemplateModel.findOne({actionType: actionType});
        } catch (e) {
            return null;
        }
    }

    public deleteById = (viewer: IUser, id) => {
        return this.mailTemplateModel.findByIdAndRemove(id);
    }

    public renderTemplate = async (viewer: IUser, id: ModelType.ID, payload: any) => {
        const template = await this.findById(viewer, id);
        const compiledTemplate = Handlebars.compile(template.template);
        return compiledTemplate(payload);
    }
}
