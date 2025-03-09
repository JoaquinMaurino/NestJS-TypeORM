import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ParseIntPipe } from '../../common/parse-int.pipe';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';
import { BrandsService } from '../services/brands.service';

import { FilterOptionsDto } from '../../common/filter-options.dto';

@ApiTags('Brands')
@Controller('Brands')
export class BrandsController {
  constructor(private brandsService: BrandsService) {}
  @Get()
  getBrands(
    @Query() params: FilterOptionsDto
  ) {
    return this.brandsService.findAll(params);
  }
  @Get('/:id')
  getBrand(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.findOne(id);
  }
  @Post()
  createBrand(@Body() payload: CreateBrandDto) {
    return this.brandsService.createOne(payload);
  }
  @Put('/:id')
  updateBrand(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBrandDto,
  ) {
    return this.brandsService.updateOne(id, payload);
  }
  @Delete('/:id')
  deleteBrand(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.deleteOne(id);
  }
}
