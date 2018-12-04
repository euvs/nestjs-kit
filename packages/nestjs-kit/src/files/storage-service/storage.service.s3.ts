import * as path from 'path';
import {IStorageInterface} from './storage.interface';
import {NotImplementedException} from '@nestjs/common';

const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

import * as _ from 'lodash';
import * as uuid from 'uuid/v4';
import {StorageProvider} from './storage.provider.enum';

export interface IStorageS3Config {
    type: StorageProvider;
    bucketName: string;
    secretAccessKey: string;
    accessKeyId: string;
    region: string;
}

// const s3Config = config.storage.s3;


export class StorageServiceS3 implements IStorageInterface {

    private uploader;
    private readonly storage;
    private readonly config: IStorageS3Config;
    private readonly s3;

    constructor(storageConfig: IStorageS3Config) {
        this.config = storageConfig;

        AWS.config.update({
            secretAccessKey: this.config.secretAccessKey,
            accessKeyId: this.config.accessKeyId,
            region: this.config.region,
        });
        this.s3 = new AWS.S3();

        this.uploadSingle = this.uploadSingle.bind(this);

        this.storage = multerS3({
            s3: this.s3,
            bucket: this.config.bucketName,
            acl: 'public-read',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (req, file, cb) => {
                const storageSubDirName = _.get(req, 'storageSubDirName', 'jobs');
                const extension = path.extname(file.originalname);
                const id = uuid();
                const filePath = `imgs/${storageSubDirName}/${id}-${file.fieldname}${extension}`;
                cb(null, filePath);
            },
        });

        this.uploader = multer({
            storage: this.storage,
            limits: {fileSize: 50000000}, // 5mb
        });
        // this.uploader = multer({ dest: config.fileUploadDir });
    }

    public uploadSingle = (name) => {
        return this.uploader.single(name);
    }
    public uploadMultiple = (name) => {
        return this.uploader.array(name);
    }

    public getFilePath = (file) => {
        return null;
    }

    public serveFile = (file, res) => {
        throw new Error('Cannot serve file from s3 storage');
    }

    public deleteFile = async (file) => {
        throw new NotImplementedException('delete file from s3 has not been implemented yet');
    }
}

