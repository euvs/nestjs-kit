import {ApiModelProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString} from 'class-validator';

export class PasswordForgotDto {

    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    public readonly email: string;
}
