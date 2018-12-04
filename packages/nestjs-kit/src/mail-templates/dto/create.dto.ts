import {ApiModelProperty} from '@nestjs/swagger';
import {IsString, Allow, IsOptional} from 'class-validator';

export class CreateDto {
    @ApiModelProperty()
    @IsString()
    public readonly name: string;

    @ApiModelProperty()
    @IsString()
    public readonly template: string;

    @ApiModelProperty()
    @IsString()
    public readonly actionType: string;

    @ApiModelProperty()
    @IsOptional()
    public readonly metadata: any;
}
