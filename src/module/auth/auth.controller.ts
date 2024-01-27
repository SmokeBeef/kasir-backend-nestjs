import { Body, Controller, Post, Res } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginUserDto } from './dto/login-user';
import wrapper from 'utils/wrapper';
import * as bcrypt from 'bcrypt';
import config from 'utils/config';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('/login')
  async login(@Body() payload: LoginUserDto, @Res() res: Response) {
    try {
      const { username, password } = payload;

      const findUser = await this.userService.findByUsername(username);
      if (!findUser) {
        return wrapper.response(
          res,
          null,
          'username or password not match',
          401,
        );
      }

      const checkPassword = await bcrypt.compare(password, findUser.password);
      if (!checkPassword) {
        return wrapper.response(
          res,
          null,
          'username or password not match',
          401,
        );
      }

      delete findUser.password;

      const tokenPayload = {
        sub: findUser.id,
        username: findUser.username,
        name: findUser.name,
        ttl: new Date().getTime(),
      };
      const token = await this.jwtService.signAsync(tokenPayload, {
        secret: config.jwt.accessToken.secretKey,
        expiresIn: config.jwt.accessToken.expiresIn,
      });

      return wrapper.response(
        res,
        { token, ...findUser },
        'Success Login',
        200,
      );
    } catch (error) {
      console.log(error);

      return wrapper.response(res, null, 'internal error', 500);
    }
  }
}
