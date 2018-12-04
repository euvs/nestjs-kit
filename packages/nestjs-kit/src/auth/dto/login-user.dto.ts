import {ApiModelProperty} from '@nestjs/swagger';
import {IsString, IsNotEmpty} from "class-validator";

export class LoginUserDto {

    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    public readonly email: string;

    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    public readonly password: string;
}
