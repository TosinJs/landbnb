import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator"

export class CreateListingDto {

    @IsNotEmpty()
    @IsNumber()
    ownerId: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    cost: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    maxGuests: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    numOfBeds: number;

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsArray()
    images: string[];
}
