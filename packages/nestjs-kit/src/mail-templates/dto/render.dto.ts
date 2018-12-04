import {ApiModelProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, IsOptional, IsIn, Allow} from 'class-validator';

export class RenderDto {
    @ApiModelProperty()
    @Allow()
    public readonly vars: any;

}
