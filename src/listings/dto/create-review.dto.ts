import { IsNotEmpty, IsString, IsNumber } from "class-validator"

export class CreateReviewDto {

    @IsNotEmpty()
    @IsNumber()
    authorId: number;

    @IsNotEmpty()
    @IsString()
    review: string;
}
