import {Inject, Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';

import {IStorageConfig, IStorageInterface, StorageProvider} from './storage-service';
import {FileSchemaName, IFile, FileModelType, IUser, ModelType} from '../db-models';
import {FILES_MODULE_STORAGE_SERVICE} from './files.constants';

@Injectable()
export class FileService {
    private storage: IStorageInterface;
    private storageConfig: IStorageConfig;

    constructor(
        @Inject(FILES_MODULE_STORAGE_SERVICE) private readonly storageService: { storage: IStorageInterface, config: IStorageConfig },
        @InjectModel(FileSchemaName) private readonly fileModel: FileModelType,
    ) {
        this.storage = storageService.storage;
        this.storageConfig = storageService.config;
    }

    public async findById(viewer: IUser, id: ModelType.ID): Promise<IFile> {
        if (!id) {
            return null;
        }
        return this.fileModel
            //.setAcl(viewer)
            .findOne({_id: id}).exec();
    }

    public serveFile(file, res) {
        return this.storage.serveFile(file, res);
    }

    public async create(props) {
        let file = new this.fileModel(props);
        file = await file.save();
        file.url = null;
        switch (this.storageConfig.provider) {
            case StorageProvider.s3:
                file.url = props.location;
                break;
            case StorageProvider.disk:
                file.url = `${this.storageConfig.disk.hostApiURL}/files/${file.id}`;
                break;
            default:
                throw new InternalServerErrorException('Unknown storage provider', this.storageConfig.provider);

        }
        return file;
    }

    public async removeById(viewer: IUser, fileId) {
        const file = await this.findById(viewer, fileId);
        return await file.remove();
    }

    public async remove(viewer: IUser, file) {
        return await file.remove();
    }
}
