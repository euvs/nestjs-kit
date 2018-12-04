import {ApiModelProperty} from '@nestjs/swagger';
import {IsString, IsNotEmpty} from "class-validator";

export class ChangePasswordDto {
    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    public readonly newPassword: string;

    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    public readonly oldPassword: string;
}
