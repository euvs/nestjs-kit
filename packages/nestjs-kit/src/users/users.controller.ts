import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import {UsersService} from './users.service';
import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';
import {UpdateUserDto, CreateUserDto, ChangePasswordDto} from './dto';
import {RolesGuard} from '../common/roles';
import {Roles} from '../common/roles';
import {User} from '../common';
import {Pagination, PaginationOptions} from '../common';
import {toListResponse} from '../common';
import {IUser} from '../db-models';

@ApiUseTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {

    constructor(private readonly userService: UsersService) {
    }

    @Get()
    @Roles('admin')
    public async findAll(
        @Pagination() pagination: PaginationOptions,
        @User() viewer: IUser,
    ) {
        const count = await this.userService.countAll(viewer);
        const items = await this.userService.listAll(viewer, pagination);
        return toListResponse(items, pagination, count);
    }

    @Post()
    @Roles('admin')
    public async create(
        @User() viewer: IUser,
        @Body() createUserDto: CreateUserDto,
    ) {
        const {email, password, role} = createUserDto;
        return await this.userService.create(viewer, {email, password, role});
    }

    @Get('/me')
    public async getMe(@User() viewer: IUser) {
        return await this.userService.findById(viewer, viewer.id);
    }

    @Post('/me/password')
    public async changePassword(@User() user, @Body() changePasswordDto: ChangePasswordDto) {
        const {id} = user;
        return this.userService.changePassword(
            id,
            changePasswordDto.oldPassword,
            changePasswordDto.newPassword,
        );
    }

    @Get(':id')
    @Roles('admin')
    public async findOne(
        @Param('id') id,
        @User() viewer: IUser,
    ) {
        const user = await this.userService.findById(viewer, id);
        if (!user) {
            throw new NotFoundException();
        }
        return user;
    }

    @Delete(':id')
    @Roles('admin')
    public async deleteOne(
        @User() viewer,
        @Param('id') id,
    ) {
        await this.userService.deleteById(viewer, id);
        return {'message': 'Deleted'};
    }

    @Put(':id')
    @Roles('admin')
    public async update(
        @Param('id') id,
        @User() viewer: IUser,
        @Body() updateUserDto: UpdateUserDto,
        @Req() req,
    ) {
        const {role} = updateUserDto;

        const userModel = await this.userService.update(viewer, {id, role});
        if (!userModel) {
            throw new NotFoundException();
        }

        return userModel;
    }

}
