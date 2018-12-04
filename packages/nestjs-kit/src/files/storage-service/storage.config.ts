import {StorageProvider} from './storage.provider.enum';
import {IStorageS3Config} from './storage.service.s3';
import {IStorageDiskConfig} from './storage.service.disk';

export interface IStorageConfig {
    provider: StorageProvider;
    s3: IStorageS3Config;
    disk: IStorageDiskConfig;
}

let _storageConfig: IStorageConfig = null;

export const setStorageConfig = (config: IStorageConfig): IStorageConfig => {
    _storageConfig = config;
    return _storageConfig;
};

export const getStorageConfig = (): IStorageConfig => {
    return _storageConfig;
};
