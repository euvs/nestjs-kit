import {ApiModelProperty} from '@nestjs/swagger';
import {IsIn, IsOptional} from 'class-validator';

export class UpdateDto {
    @ApiModelProperty()
    @IsOptional()
    public readonly name: string;

    @ApiModelProperty()
    @IsOptional()
    public readonly template: string;

    @ApiModelProperty()
    @IsOptional()
    public readonly actionType: string;

    @ApiModelProperty()
    @IsOptional()
    public readonly metadata: any;
}
