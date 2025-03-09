import { IsString, IsNotEmpty, IsPhoneNumber, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/swagger';


export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  readonly phone: string;

}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) { }