import { IsOptional, IsPositive, Min, ValidateIf } from 'class-validator';

export class FilterOptionsDto {
  @IsOptional()
  @IsPositive()
  limit?: number;

  @IsOptional()
  @Min(0)
  offset?: number;

  @ValidateIf((query)=>query.maxPrice)
  @IsPositive()
  minPrice?: number;

  @ValidateIf((query)=>query.minPrice)
  @IsPositive()
  maxPrice?: number;

  @IsOptional()
  @IsPositive()
  brandId?: number;
}
