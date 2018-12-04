import {DynamicModule, Module} from '@nestjs/common';

import {MongooseModule} from '@nestjs/mongoose';
import {FileSchema, FileSchemaName} from '../db-models';
import {FileService} from './files.service';
import {FilesController} from './files.controller';
import {createStorage, IStorageConfig} from './storage-service';
import {FILES_MODULE_STORAGE_SERVICE} from './files.constants';

@Module({})
export class FilesModule {
    public static forRoot(
        config: IStorageConfig,
    ): DynamicModule {
        const storage = createStorage(config);
        return {
            module: FilesModule,
            imports: [
                MongooseModule.forFeature([{name: FileSchemaName, schema: FileSchema}]),
            ],
            providers: [
                {provide: FILES_MODULE_STORAGE_SERVICE, useValue: {storage, config}},
                FileService,
            ],

            exports: [FILES_MODULE_STORAGE_SERVICE],
            controllers: [FilesController],
        };
    }

    public static forFeature(): DynamicModule {
        return {
            module: FilesModule,
            imports: [FilesModule],
            providers: [FileService],
        };
    }
}
