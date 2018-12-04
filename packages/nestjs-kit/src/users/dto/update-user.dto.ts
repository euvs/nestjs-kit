import {ApiModelProperty} from '@nestjs/swagger';
import {IsIn, IsOptional} from 'class-validator';

export class UpdateUserDto {

    @ApiModelProperty()
    @IsOptional()
    @IsIn(['admin', 'user'])
    public readonly role: 'admin' | 'user';
}
