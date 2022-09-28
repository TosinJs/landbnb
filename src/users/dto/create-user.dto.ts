import { IsNotEmpty, Length, IsEmail, IsNumber, IsPositive, IsString } from "class-validator"

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
    @IsPositive()
    age;

    @IsNotEmpty()
    @Length(3, 100, {
        message: "The shortest country name is four characters long"
    })
    @IsString()
    country; 

    @IsNotEmpty()
    @IsString()
    personalDesc;
    
    @IsNotEmpty()
    @IsString()
    profilePicture
}
