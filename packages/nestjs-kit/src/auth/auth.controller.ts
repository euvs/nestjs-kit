import {BadRequestException, Body, Controller, Post, Put, Req, UnauthorizedException} from '@nestjs/common';
import {AuthService} from './auth.service';
import {ApiUseTags} from '@nestjs/swagger';
import {SignupUserDto} from './dto/signup-user.dto';
import {LoginUserDto} from './dto/login-user.dto';
import {PasswordForgotDto} from './dto/password-forgot.dto';
import {PasswordResetDto} from './dto/password-reset.dto';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {
    }

    @Post('login')
    public async login(@Body() body: LoginUserDto) {
        const {email, password} = body;
        const user = await this.authService.validateCredentials(email, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        const token = await this.authService.createToken(user);
        return {...token, user: user};
    }

    @Post('signup')
    public async signup(@Body() body: SignupUserDto) {
        const {email, password} = body;
        try {
            const user = await this.authService.signupUser({email, password});
            const token = await this.authService.createToken(user);
            return {...token, user: user};
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    @Post('password-forgot')
    public async passwordForgot(@Body() body: PasswordForgotDto) {
        const {email} = body;
        const res = await this.authService.passwordForgot(email);
        if (res === true) {
            return {password: 'Request accepted'};
        }

        throw new BadRequestException('Failed to request a password reset');
    }

    @Post('password-reset')
    public async passwordReset(@Body() body: PasswordResetDto) {
        const {token, password} = body;
        const user = await this.authService.passwordReset(token, password);
        const userToken = await this.authService.createToken(user);
        return {...userToken, user: user};
    }
}
