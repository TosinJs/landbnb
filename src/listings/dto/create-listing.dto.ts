import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateListingDto {

    @IsNotEmpty()
    @IsNumber()
    ownerId: number;

    @IsNotEmpty()
    @IsNumber()
    cost: number;

    @IsNotEmpty()
    @IsNumber()
    location: string;
}
