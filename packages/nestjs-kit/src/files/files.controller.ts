import {Controller, Delete, Get, NotFoundException, Param, Post, Req, Res} from '@nestjs/common';
import {FileService} from './files.service';
import {ApiBearerAuth, ApiUseTags, ApiOperation} from '@nestjs/swagger';
import {User} from '../common/user.decorator';
import {IUser} from '../db-models';

@ApiUseTags('files')
@ApiBearerAuth()
@Controller('files')
export class FilesController {

    constructor(private readonly fileService: FileService) {
    }

    @Get(':id')
    @ApiOperation({title: 'Get file', operationId: 'get_file'})
    public async serveFile(
        @Res() res,
        @User() viewer: IUser,
        @Param('id') id: string,
    ) {
        const file = await this.fileService.findById(viewer, id);
        if (!file) {
            throw new NotFoundException();
        }
        return this.fileService.serveFile(file, res);
    }
}
