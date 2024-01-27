import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';

import wrapper from 'src/utils/wrapper';
import { deleteImageUser, uploadImageUser } from 'src/utils/upload';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { calcTakeSkip, isNumeric, metaPagination } from 'src/utils/pagination';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      if (!image) {
        return wrapper.response(res, null, 'image not found', 400);
      }

      const isUsernameUsed = await this.usersService.findByUsername(
        createUserDto.username,
      );

      if (isUsernameUsed) {
        return wrapper.response(res, null, 'username already used', 400);
      }

      const imageUrl = await uploadImageUser(image);

      createUserDto.image = imageUrl;
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

      const result = await this.usersService.create(createUserDto);
      return wrapper.response(res, result, 'success create new user', 201);
    } catch (error) {
      return wrapper.response(res, null, error.message, 500);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    try {
      const { page: pageNow, perpage } = req.query;

      const { skip, take, page } = calcTakeSkip(pageNow, perpage);

      const condition: Prisma.userFindManyArgs = {
        take,
        skip,
        select: {
          id: true,
          image: true,
          name: true,
          username: true,
          created_at: true,
        },
      };
      const count = this.usersService.count();
      const getAll = this.usersService.findAll(condition);

      const [totalData, result] = await Promise.all([count, getAll]);
      const meta = metaPagination(page, take, totalData);
      return wrapper.response(res, result, 'success get all users', 200, meta);
    } catch (error) {
      console.log(error);

      return wrapper.response(res, null, error.message, 500);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    if (!isNumeric(id))
      return wrapper.response(
        res,
        null,
        'failed get user by id, params id must be numeric',
        400,
      );

    const result = await this.usersService.findOne(+id);

    if (!result)
      return wrapper.response(
        res,
        null,
        `failed get user by id, id not found`,
        404,
      );

    return wrapper.response(res, result, `success get user by id`, 200);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const findUser = await this.usersService.findOne(+id);
      if (!findUser)
        return wrapper.response(
          res,
          null,
          'failed delete user, id not found',
          404,
        );
      const deleteImage = await deleteImageUser(findUser.image);
      if (!deleteImage) {
        return wrapper.response(
          res,
          null,
          'failed delete user, cannot delete image',
          500,
        );
      }
      const deleteUser = await this.usersService.delete(+id);
      return wrapper.response(res, deleteUser, 'success delete user', 200);
    } catch (error) {
      return wrapper.response(res, null, error.message, 500);
    }
  }
}
