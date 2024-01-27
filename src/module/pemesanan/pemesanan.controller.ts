import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PemesananService } from './pemesanan.service';
import { CreatePemesananDto } from './dto/create-pemesanan.dto';
import { UpdatePemesananDto } from './dto/update-pemesanan.dto';
import { MenuService } from '../menu/menu.service';
import wrapper from 'src/utils/wrapper';
import { Request as Request, Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { calcTakeSkip, isNumeric, metaPagination } from 'src/utils/pagination';
import { Prisma } from '@prisma/client';

@Controller('pemesanan')
@UseGuards(AuthGuard)
export class PemesananController {
  constructor(
    private readonly pemesananService: PemesananService,
    private readonly menuService: MenuService,
  ) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() createPemesananDto: CreatePemesananDto,
    @Res() res: Response,
  ) {
    try {
      const idMenus = createPemesananDto.detailPemesanan.map(
        (val) => val.menu_id,
      );
      const getMenus = await this.menuService.findAll({
        where: {
          id: {
            in: idMenus,
          },
        },
      });

      if (getMenus.length < idMenus.length) {
        return wrapper.response(
          res,
          null,
          'fail create pemesanan, there is menu id not found',
          404,
        );
      }

      const detailPemesanan = createPemesananDto.detailPemesanan.map((val) => {
        const menu = getMenus.find((menu) => menu.id === val.menu_id);

        if (menu) {
          val.menu_name = menu.name;
          val.total = val.qty * menu.price;
        }

        return val;
      });

      createPemesananDto.detailPemesanan = detailPemesanan;

      createPemesananDto.user_name = req['user'].name;
      createPemesananDto.user_id = req['user'].sub;
      createPemesananDto.total = createPemesananDto.detailPemesanan.reduce(
        (prev, curr) => prev + curr.total,
        0,
      );

      if (createPemesananDto.total > createPemesananDto.total_payment) {
        return wrapper.response(
          res,
          null,
          'failed create, total payment not enough',
          409,
        );
      }

      const result = await this.pemesananService.create(createPemesananDto);
      return wrapper.response(res, result, 'success create new pemesanan', 201);
    } catch (error) {
      console.log(error);
      return wrapper.response(res, null, 'intenal error', 500);
    }
  }

  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    const { page: pageNow, perpage } = req.query;

    const { skip, take, page } = calcTakeSkip(pageNow, perpage);

    const option: Prisma.pemesananFindManyArgs = {
      skip,
      take,
    };

    const getAll = this.pemesananService.findAll(option);
    const count = this.pemesananService.count();
    const [result, totalData] = await Promise.all([getAll, count]);
    const meta = metaPagination(page, take, totalData);

    return wrapper.response(
      res,
      result,
      'success get all pemesanan',
      200,
      meta,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    if (!isNumeric(id)) {
      return wrapper.response(
        res,
        null,
        'failed get one pemesanan, id params is not numeric',
        409,
      );
    }
    const result = await this.pemesananService.findOne(+id);
    return wrapper.response(res, result, 'success get pemesanan by id', 200);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePemesananDto: UpdatePemesananDto,
  ) {
    return this.pemesananService.update(+id, updatePemesananDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.pemesananService.remove(+id);
  }
}
