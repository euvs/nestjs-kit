import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import {MailTemplatesService} from './mailtemplates.service';
import {ApiBearerAuth, ApiUseTags, ApiOperation} from '@nestjs/swagger';
import {UpdateDto, CreateDto, RenderDto} from './dto';
import {User} from '../common';
import {Pagination, PaginationOptions} from '../common';
import {toListResponse} from '../common';
import {IUser, ModelType} from '../db-models';

@ApiUseTags('mail-templates')
@ApiBearerAuth()
@Controller('mail-templates')
export class MailTemplatesController {

    constructor(private readonly mailTemplatesService: MailTemplatesService) {
    }

    @Get()
    @ApiOperation({title: 'Get all mail templates'})
    public async findAll(
        @Pagination() pagination: PaginationOptions,
        @User() viewer: IUser,
    ) {
        const count = await this.mailTemplatesService.countAll(viewer);
        const items = await this.mailTemplatesService.listAll(viewer, pagination);
        return toListResponse(items, pagination, count);
    }

    @Post()
    public async create(
        @User() viewer: IUser,
        @Body() createUserDto: CreateDto,
    ) {
        return await this.mailTemplatesService.create(viewer, createUserDto);
    }

    @Post(':id/render')
    public async render(
        @Param('id') id: ModelType.ID,
        @User() viewer: IUser,
        @Body() body: RenderDto,
    ) {
        return await this.mailTemplatesService.renderTemplate(viewer, id, body.vars);
    }


    @Get(':id')
    public async findOne(
        @Param('id') id: ModelType.ID,
        @User() viewer: IUser,
    ) {
        const user = await this.mailTemplatesService.findById(viewer, id);
        if (!user) {
            throw new NotFoundException();
        }
        return user;
    }

    @Delete(':id')
    public async deleteOne(
        @User() viewer,
        @Param('id') id: ModelType.ID,
    ) {
        await this.mailTemplatesService.deleteById(viewer, id);
        return {'message': 'Deleted'};
    }

    @Put(':id')
    public async update(
        @Param('id') id: ModelType.ID,
        @User() viewer: IUser,
        @Body() dto: UpdateDto,
        @Req() req,
    ) {
        const userModel = await this.mailTemplatesService.update(viewer, id, dto);
        if (!userModel) {
            throw new NotFoundException();
        }

        return userModel;
    }

}
