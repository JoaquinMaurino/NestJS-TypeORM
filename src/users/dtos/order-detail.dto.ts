import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsPositive } from "class-validator";

export class CreateOrderDetailDto {
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  readonly orderId: number;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  readonly prodId: number;

  @IsPositive()
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  readonly  quantity?: number = 1;


}

export class UpdateOrderDetailDto extends PartialType(CreateOrderDetailDto) {}
