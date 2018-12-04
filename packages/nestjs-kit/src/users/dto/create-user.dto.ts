import {ApiModelProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, IsOptional, IsIn} from 'class-validator';

export class CreateUserDto {
    @ApiModelProperty()
    @IsOptional()
    @IsIn(['admin', 'user'])
    public readonly role: 'admin' | 'user';

    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    public readonly email: string;

    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    public readonly password: string;
}
