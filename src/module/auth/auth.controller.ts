import { Body, Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { LoginUserDto } from './dto/login-user';
import wrapper from 'src/utils/wrapper';
import * as bcrypt from 'bcrypt';
import config from 'src/utils/config';

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

      const refreshToken = await this.jwtService.signAsync(tokenPayload, {
        secret: config.jwt.refreshToken.secretKey,
        expiresIn: config.jwt.refreshToken.expiresIn,
      });

      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 5);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: config.jwt.refreshToken.expiresInMs,
      });

      return wrapper.response(
        res,
        { token, ...findUser, expires: expires.getTime() },
        'Success Login',
        200,
      );
    } catch (error) {
      console.log(error);

      return wrapper.response(res, null, 'internal error', 500);
    }
  }

  @Get('/refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      wrapper.response(
        res,
        null,
        "can't get new token, refreshToken not found",
        401,
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: config.jwt.refreshToken.secretKey,
      });

      const accessToken = await this.jwtService.signAsync(
        {
          ...payload,
          ttl: Date.now(),
        },
        { secret: config.jwt.accessToken.secretKey },
      );
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 5);

      return wrapper.response(
        res,
        { token: accessToken, expires: expires.getDate() },
        'success get new token',
        200,
      );
    } catch (error) {
      console.log(error.message);

      return wrapper.response(res, null, 'failed, token not sign', 401);
    }
  }

  @Delete('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      res.clearCookie('refreshToken');
      return wrapper.response(res, null, 'success login', 200);
    } catch (error) {
      return wrapper.response(res, null, 'internal error', 500);
    }
  }
}
