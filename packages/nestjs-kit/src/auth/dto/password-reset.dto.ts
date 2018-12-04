import {ApiModelProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString} from 'class-validator';

export class PasswordResetDto {

    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    public readonly token: string;

    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    public readonly password: string;

}
