import {IBaseDocument, IEntityDocument} from './schema-base';

import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
const crypto = require('crypto');
const authTypes = ['github', 'twitter', 'facebook', 'google'];
import {updateTimePlugin, ACLPlugin, IAclPlugin} from './plugins';
import {Model} from 'mongoose';

export const UserSchemaName = 'User';

export interface IUser extends IBaseDocument, IEntityDocument {
    name: string;
    email: string;
    role: string;
    password: string;
    hashedPassword: string;
    resetPasswordToken: string;
    resetPasswordExpires: number;
    provider: string;
    salt: string;
    profile: any;
    authenticate: (password: string) => boolean;
}

export const UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    hashedPassword: String,
    provider: String,
    salt: String,
    facebook: {},
    twitter: {},
    google: {},
    github: {},
});

UserSchema.set('toJSON', {
    transform: (doc, ret: IUser, options) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.provider;
        delete ret.hashedPassword;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        delete ret.salt;
        return ret;
    },
});

/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

// Public profile information
UserSchema
    .virtual('profile')
    .get(function () {
        return {
            _id: this._id,
            name: this.name,
            role: this.role,
            email: this.email,
        };
    });

// Non-sensitive info we'll be putting in the token
UserSchema
    .virtual('token')
    .get(function () {
        return {
            _id: this._id,
            role: this.role,
        };
    });

/**
 * Validations
 */

// Validate empty email
UserSchema
    .path('email')
    .validate(function (email) {
        if (authTypes.indexOf(this.provider) !== -1) {
            return true;
        }
        return email.length;
    }, 'Email cannot be blank');

UserSchema
    .path('email')
    .validate({
        isAsync: true,
        validator: function (value, respond) {
            const self = this;
            return this.constructor.findOne({email: value}).exec()
                .then((user: IUser) => {
                    if (user) {
                        if (self.id === user.id) {
                            return respond(true);
                        }
                        return respond(false);
                    }
                    return respond(true);
                })
                .catch((err) => {
                    throw err;
                });
        },
        message: 'The specified email address is already in use.',
    });

// Validate empty password
UserSchema
    .path('hashedPassword')
    .validate((hashedPassword) => {
        if (authTypes.indexOf(this.provider) !== -1) {
            return true;
        }
        return hashedPassword.length;
    }, 'Password cannot be blank');

const validatePresenceOf = (value) => value && value.length;

/**
 * Pre-save hook
 */
UserSchema
    .pre('save', (next) => {
        if (!this.isNew) {
            return next();
        }

        if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1) {
            next(new Error('Invalid password'));
        } else {
            next();
        }
    });

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate(plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt() {
        return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword(password) {
        if (!password || !this.salt) {
            return '';
        }
        const salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
    },
};

UserSchema.plugin(updateTimePlugin);
UserSchema.plugin(ACLPlugin);

type M = Model<IUser>;
export type ModelUserType = M & IAclPlugin<IUser>;
export default mongoose.model<IUser>(UserSchemaName, UserSchema) as ModelUserType;
