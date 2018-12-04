import * as jwt from 'jsonwebtoken';
import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {IUser} from '../db-models';
import {UsersService} from '../users';
import * as crypto from 'crypto';
import {ModelOrId, ModelType} from '../db-models';
import {AUTH_MODULE_CONFIG} from './auth.constants';
import {IAuthConfig} from './auth.config';
import {INotificationsService, NOTIFICATION_SERVICE_NAME} from '../types';

const randomString = (size) => {
    if (size === 0) {
        throw new Error('Zero-length randomString is useless.');
    }
    const chars = (
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz' +
        '0123456789'
    );
    let objectId = '';
    const bytes = crypto.randomBytes(size);
    for (let i = 0; i < bytes.length; ++i) {
        objectId += chars[bytes.readUInt8(i) % chars.length];
    }
    return objectId;
};

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        @Inject(NOTIFICATION_SERVICE_NAME) private readonly notificationService: INotificationsService,
        @Inject(AUTH_MODULE_CONFIG) private readonly authConfig: IAuthConfig,
    ) {
    }

    public async populateUser(userOrId: ModelOrId<IUser>): Promise<IUser> {
        let user: IUser;
        if (ModelType.isId(userOrId)) {
            user = await this.userService.findById(null, ModelType.extractId(userOrId));
        } else {
            user = userOrId;
        }

        return user;
    }

    public async createToken(userOrId: ModelOrId<IUser>): Promise<{ token: string, expires_in: number }> {
        const expiresIn = this.authConfig.tokenExpiration;
        const secretOrKey = this.authConfig.secret;

        const user = await this.populateUser(userOrId);

        const userData = {
            email: user.email,
            id: user.id,
            hash: user.hashedPassword.substr(0, 5),
        };
        const token = jwt.sign(userData, secretOrKey, {expiresIn});
        return {
            expires_in: expiresIn,
            token,
        };
    }

    public async signupUser(input: { email: string, password: string, role?: string }) {
        return this.userService.create(null, input);
    }

    public async validateUser(parsedJwtToken): Promise<IUser> {
        const {email, hash} = parsedJwtToken;
        if (!email || !hash) {
            return null;
        }

        const user = await this.userService.findByEmail(email);

        if (user) {
            // Check password hash
            if (user.hashedPassword.substr(0, 5) !== hash) {
                return null;
            }

            return user;
        }
        return null;
    }

    public validateCredentials = async (email, password): Promise<IUser> => {
        if (!email || !password) {
            return null;
        }

        const user = await this.userService.findByEmail(email);

        if (!user) {
            return null;
        }
        if (!user.authenticate(password)) {
            return null;
        }

        return user;
    }

    public passwordForgot = async (email): Promise<boolean> => {
        if (!email) {
            throw new BadRequestException('Expected email');
        }

        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new BadRequestException('User not found');
        }

        const token = randomString(26);
        email = email.toLowerCase();
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        const notficationResult = await this.notificationService.sendNotification(null, {type: 'PASSWORD_RESET', payload: {token, email}});

        return true;
    }

    public passwordReset = async (token: string, newPassword: string): Promise<IUser> => {
        if (!token || !newPassword) {
            throw new BadRequestException('Expected email');
        }

        const user = await this.userService.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}});

        if (!user) {
            throw new BadRequestException('Password reset token is invalid or has expired.');
        }

        user.password = newPassword;
        user.resetPasswordExpires = null;
        user.resetPasswordToken = null;

        await user.save();

        const notficationResult = await this.notificationService.sendNotification(null, {type: 'PASSWORD_CHANGED', payload: {email: user.email}});

        // const mailerResult = await this.mailerService.sendPasswordChangedEmail(user.email);

        return user;
    }
}
