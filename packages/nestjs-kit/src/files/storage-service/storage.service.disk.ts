import * as path from 'path';
import * as fs from 'fs';
import {IStorageInterface} from './storage.interface';
import {IFile} from '../../db-models';
import * as uuid from 'uuid/v4';
import {StorageProvider} from './storage.provider.enum';

const multer = require('multer');

export interface IStorageDiskConfig {
    type: StorageProvider;
    fileUploadDir: string;
    hostApiURL: string;
}

export class StorageServiceDisk implements IStorageInterface {

    private uploader;
    private readonly storage;
    private readonly config;

    constructor(storageConfig: IStorageDiskConfig) {
        this.config = storageConfig;
        console.log('Uploads directory', storageConfig.fileUploadDir);

        this.uploadSingle = this.uploadSingle.bind(this);

        if (!fs.existsSync(storageConfig.fileUploadDir)) {
            try {
                fs.mkdirSync(storageConfig.fileUploadDir);
            } catch (error) {
                throw new Error(`Could not create upload dir '${storageConfig.fileUploadDir}'. Error: ${error}`);
            }
        }

        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, storageConfig.fileUploadDir);
            },
            filename: (req, file, cb) => {
                const extension = path.extname(file.originalname);
                const id = uuid();
                cb(null, `${id}-${file.fieldname}${extension}`);
            },
        });

        this.uploader = multer({
            storage: this.storage,
            limits: {fileSize: 50000000}, // 5mb
        });

    }

    public uploadSingle = (name) => {
        return this.uploader.single(name);
    }

    public uploadMultiple = (name) => {
        return this.uploader.array(name);
    }

    public getFilePath = (file: IFile): string => {
        return path.resolve(this.config.fileUploadDir, file.filename);
    }

    public serveFile = (file: IFile, res) => {

        if (!file || !file.filename) {
            res.set('Content-Type', 'text/plain');
            res.status(404).end('Not found');
            return;
        }

        const filepath = this.getFilePath(file);
        const originalName = file.originalname;
        const mimetype = file.mimetype || 'text/plain';
        const options = {
            headers: {
                'Content-Type': mimetype,
            },
        };

        res.download(filepath, originalName, options);
    }

    public deleteFile = async (file) => {
        const filepath = this.getFilePath(file);
        return new Promise((resolve, reject) => {
            fs.unlink(filepath, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }
}
