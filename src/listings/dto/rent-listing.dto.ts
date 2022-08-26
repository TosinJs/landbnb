import { IsNotEmpty, IsNumber} from "class-validator"

export class RentListingDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;
}
