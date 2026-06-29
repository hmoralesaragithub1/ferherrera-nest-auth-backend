import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
//import { CreateUserDto } from './dto/create-user.dto';
//import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
//import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';

import { LoginDto, CreateUserDto, UpdateAuthDto, RegisterUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // 1. encriptar la contraseña
      const { password, ...userData } = createUserDto;
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData,
      });
      // 2. guardar el usuario
      await newUser.save();

      // password: _ excluyo el pass para no retornarlo en la rpta
      const { password: _, ...user } = newUser.toJSON();
      return user;
      // 3. generar jwt
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} ya existe`);
      }
      throw new InternalServerErrorException(
        'Problemas del servidor para responder',
      );
    }
  }

  async register(registerUserDto: RegisterUserDto): Promise<LoginResponse> {
    const user = await this.create(registerUserDto);
    return {
      user: user,
      token: this.getJWTToken({ id: user._id }),
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    // debo regresar
    // user={_id,email,password, name, roles}
    // token de acceso(jwt): hfhfhfh.*fjjjfj

    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Not valid credentials-email not found');
    }

    // comparamos si la contraseña enviada es la misma del usuario en bd
    if (!bcryptjs.compareSync(password, user.password!)) {
      throw new UnauthorizedException(
        "Not valid credentials-password didn't match",
      );
    }
    console.log({ loginDto });

    const { password: _, ...rest } = user.toJSON();
    return {
      user: rest,
      token: this.getJWTToken({ id: user.id }), //_id es object, si queremos solo el string usamos id,
    };
  }

  getJWTToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById(id: string) {
    const user = await this.userModel.findById(id);
    console.log({ user });

    if (user) {
      const { password, ...rest } = user.toJSON();
      return rest;
    }
    
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
