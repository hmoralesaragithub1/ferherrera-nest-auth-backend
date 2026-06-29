import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  // validacion de como recibimos la data del body de la peticion
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @MinLength(6)
  password: string;
}
