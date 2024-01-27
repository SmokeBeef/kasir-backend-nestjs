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
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Request, Response } from 'express';
import wrapper from 'src/utils/wrapper';
import { FileInterceptor } from '@nestjs/platform-express';
import { deleteImageMenu, uploadImageMenu } from 'src/utils/upload';
import { calcTakeSkip, isNumeric, metaPagination } from 'src/utils/pagination';
import { Prisma } from '@prisma/client';

@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async create(
    @Body() createMenuDto: CreateMenuDto,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      if (!image) {
        return wrapper.response(
          res,
          null,
          'failed create menu, image not found',
          404,
        );
      }
      const imageUrl = await uploadImageMenu(image);
      if (!imageUrl) {
        return wrapper.response(res, null, 'cannot upload image', 500);
      }
      createMenuDto.image = imageUrl;
      createMenuDto.price = +createMenuDto.price;
      const result = await this.menuService.create(createMenuDto);
      return wrapper.response(res, result, 'success create new menu', 201);
    } catch (error) {
      console.log(error);

      return wrapper.response(res, null, 'internal error', 500);
    }
  }

  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    try {
      const { page: pageNow, perpage } = req.query;

      const { skip, take, page } = calcTakeSkip(pageNow, perpage);

      const option: Prisma.menuFindManyArgs = { skip, take };

      const count = this.menuService.count();
      const getAll = this.menuService.findAll(option);

      const [totalData, result] = await Promise.all([count, getAll]);

      const meta = metaPagination(page, take, totalData);
      return wrapper.response(res, result, 'success get all menus', 200, meta);
    } catch (error) {
      console.log(error);
      return wrapper.response(res, null, 'internal error', 500);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!isNumeric(id)) {
        return wrapper.response(
          res,
          null,
          'failed find menu, id params is not numeric',
          409,
        );
      }
      const result = await this.menuService.findOne(+id);
      if (!result) {
        return wrapper.response(
          res,
          null,
          'failed find menu, not found menu',
          404,
        );
      }
      return wrapper.response(res, result, 'success find menu', 200);
    } catch (error) {
      console.log(error);
      return wrapper.response(res, null, error.message, 500);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!isNumeric(id)) {
        return wrapper.response(
          res,
          null,
          'failed delete menu, id params is not numeric',
          409,
        );
      }
      const findMenu = await this.menuService.findOne(+id);
      if (!findMenu) {
        return wrapper.response(
          res,
          null,
          'failed delete menu, id not foun',
          404,
        );
      }

      const deleteImage = deleteImageMenu(findMenu.image);
      if (!deleteImage) {
        return wrapper.response(
          res,
          null,
          'failed delete menu, cant delete image',
          500,
        );
      }
      const deleteMenu = await this.menuService.remove(+id);

      return wrapper.response(res, deleteMenu, 'success delete menu', 200);
    } catch (error) {
      console.log(error);
      return wrapper.response(res, null, error.message, 500);
    }
  }
}
