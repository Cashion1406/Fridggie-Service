/* eslint-disable prettier/prettier */
import { SuccessResponseDTO } from "@libs";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, Length } from "class-validator";
import { StepDTO } from "./step.dtos";

export class CreateStepRequestDTO {

    @ApiProperty()
    @IsNotEmpty()
    @Length(2,50,{message:'Step name must be between 2 and 50 characters'})
    name:string

    @ApiProperty()
    @IsNotEmpty()
    @Length(0,200)
    description:string

    @ApiProperty()
    @IsNotEmpty()
    user_id:number
}


export class CreateStepResponseDTO extends PartialType(SuccessResponseDTO) {

    @ApiProperty()
    @IsNotEmpty()
    step:StepDTO
}
