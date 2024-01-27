import { PartialType } from '@nestjs/mapped-types';
import { CreatePemesananDto } from './create-pemesanan.dto';

export class UpdatePemesananDto extends PartialType(CreatePemesananDto) {}
