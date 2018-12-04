import {IFile} from '../../db-models';

export interface IStorageInterface {
    uploadSingle: (name: string) => any;
    uploadMultiple: (name: string) => any;
    getFilePath: (file: IFile) => string;
    serveFile: (file, res) => any;
    deleteFile: (file) => Promise<any>;
}
