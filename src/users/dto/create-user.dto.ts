import { IsNotEmpty, Length, IsEmail, IsNumber, IsString } from "class-validator"

export class CreateUserDto {

    @IsNotEmpty()
    @Length(4, 35, {
        message: "Username should be between 4 and 25 Characters long"
      })
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsNumber()
    age: number;

    @IsNotEmpty()
    @Length(3, 100, {
        message: "The shortest country name is four characters long"
    })
    @IsString()
    country: string; 

    @IsNotEmpty()
    @IsString()
    personalDesc: string;
    
    @IsNotEmpty()
    @IsString()
    profilePicture: string;
}
