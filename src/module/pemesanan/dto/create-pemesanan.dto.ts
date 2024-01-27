import { IsEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePemesananDto {
  @IsNotEmpty()
  @IsString()
  customer_name: string;

  @IsEmpty()
  total: number;

  @IsEmpty()
  user_id: number;

  @IsEmpty()
  user_name: string;

  @IsNotEmpty()
  total_payment: number;

  @IsNotEmpty()
  detailPemesanan: DetailPemesanan[];
}

class DetailPemesanan {
  @IsNotEmpty()
  @IsNumber()
  menu_id: number;

  @IsNotEmpty()
  @IsNumber()
  qty: number;

  @IsEmpty()
  total: number;

  @IsEmpty()
  menu_name: string;
}
