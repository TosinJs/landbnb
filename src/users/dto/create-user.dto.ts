import { IsNotEmpty, Length, IsEmail } from "class-validator"

export class CreateUserDto {

    @IsNotEmpty()
    @Length(4, 35, {
        message: "Username should be between 4 and 25 Characters long"
      })
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}
