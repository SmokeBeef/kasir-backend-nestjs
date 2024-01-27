import {
  IsNotEmpty,
  IsString,
  IsEmpty,
  IsEnum,
  IsNumberString,
} from 'class-validator';

enum type {
  makanan = 'makanan',
  minuman = 'minuman',
}

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  price: number;

  @IsString()
  description: string;

  @IsEmpty()
  image: string;

  @IsNotEmpty()
  @IsEnum(type)
  type: type;
}
