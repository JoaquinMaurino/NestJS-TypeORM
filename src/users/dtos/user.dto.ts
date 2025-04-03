import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Length,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';
import { RegisterDto } from '../../auth/dtos/register.dto';

export class CreateUserDto extends RegisterDto {
  @IsOptional()
  @IsPositive()
  @ApiProperty()
  readonly customerId?: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
