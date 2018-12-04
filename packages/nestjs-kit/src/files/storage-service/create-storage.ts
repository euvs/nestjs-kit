import {StorageServiceDisk, getStorageConfig, IStorageConfig, StorageServiceS3, StorageProvider} from './';
import {IStorageInterface} from './';

export const createStorage = (storageConfig: IStorageConfig): IStorageInterface => {
    switch (storageConfig.provider) {
        case StorageProvider.s3:
            return new StorageServiceS3(storageConfig.s3);
        case StorageProvider.disk:
            return new StorageServiceDisk(storageConfig.disk);
        default:
            throw new Error('Unknown storage provider ' + storageConfig.provider);
    }
};
