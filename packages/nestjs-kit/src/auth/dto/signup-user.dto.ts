import {ApiModelProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString} from 'class-validator';

export class SignupUserDto {

    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    public readonly email: string;

    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    public readonly password: string;
}
