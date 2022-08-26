import { IsBoolean, IsNumber, IsOptional } from "class-validator"

export class UpdateListingDto {

    @IsOptional()
    @IsNumber()
    cost?: number;

    @IsOptional()
    @IsBoolean()
    available?: boolean;
}
