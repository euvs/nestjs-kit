import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {IUser, IUser as User, ModelUserType, UserSchemaName} from '../db-models';
import {PaginationOptions} from '../common';
import {findAllWithRestQuery} from '../db-models';
import {ModelType} from '../db-models';

@Injectable()
export class UsersService {

    constructor(@InjectModel(UserSchemaName) private readonly userModel: ModelUserType) {
    }

    public async countAll(viewer: IUser) {
        return this.userModel.setAcl(viewer).estimatedDocumentCount().exec();
    }

    public async listAll(viewer: IUser, pagination: PaginationOptions, filters?: any) {
        let r = this.userModel.setAcl(viewer).find({});
        r = findAllWithRestQuery(r, pagination, filters);
        // r = r.populate(this.populateFields);

        try {
            return await r.exec();
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }

    public async create(viewer: IUser, input: { email: string, password: string, role?: string }) {
        const {email, password, role = 'user'} = input;
        let newUser = new this.userModel({email, password, role});
        newUser.provider = 'local';
        try {
            newUser = await newUser.save();
            return newUser;
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }

    public async changeRole(viewer: IUser, userId, newRole) {
        return await this.update(viewer, {id: userId, role: newRole}, true);
    }

    public async update(viewer: IUser, data: Partial<IUser>, forceUpdate: boolean = false): Promise<IUser> {
        const {id} = data;
        let user = await this.findById(viewer, id);
        if (!user) {
            throw new NotFoundException();
        }

        if (data.role && (forceUpdate || (user.id !== viewer.id))) {
            // Only allow changing role for someone else,
            // to prevent your own lockout (e.g. change 'admin'->'user').
            user.role = data.role;
            user = await user.save();
        }
        return user;
    }

    public async findById(viewer: IUser, id: ModelType.ID): Promise<IUser> {
        if (!id) {
            return null;
        }

        try {
            return await this.userModel.findById(id);
        } catch (e) {
            return null;
        }
    }

    public deleteById = (viewer: IUser, id) => {
        if (id === viewer.id) {
            throw new BadRequestException('Cannot self-delete');
        }
        return this.userModel.findByIdAndRemove(id);
    }

    public async findByEmail(email): Promise<User> {
        return this.userModel.findOne({email: email.toLowerCase()});
    }

    public async findOne(conditions?: any): Promise<User> {
        return this.userModel.findOne(conditions);
    }

    /**
     * Changes a users password
     */
    public async changePassword(userId, oldPassword, newPassword) {

        let user = await this.userModel.findById(userId);
        if (!user.authenticate(oldPassword)) {
            throw new BadRequestException('Failed to validate current password');
        }

        user.password = newPassword;
        user = await user.save();
        return user;
    }
}
