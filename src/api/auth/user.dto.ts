import { IsEmail, IsIn, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class AddUserDTO {
    @IsEmail()
    email!: string;

    @IsString()
    username!: string;

    @IsString()
    @IsIn(['admin', 'user'])
    @IsOptional()
    role?: 'admin' | 'user';

    @IsString()
    @IsStrongPassword({
        minLength: 8
    })
    password!: string;
}