import { IsSafeString } from "@/shared/utils/validations/decorators/isSafeString";
import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserRequestDto{

  @IsString()
  @IsNotEmpty()
  @IsSafeString({ message: 'Name must not contain HTML or JavaScript code' })
  @Type(()=>String)
  public fullName:string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @IsSafeString({ message: 'Name must not contain HTML or JavaScript code' })
  @Type(()=>String)
  public email:string;
}
