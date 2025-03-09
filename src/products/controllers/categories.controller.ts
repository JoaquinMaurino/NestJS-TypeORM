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
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { CategoriesService } from '../services/categories.service';

import { FilterOptionsDto } from '../../common/filter-options.dto';

@ApiTags('Categories')
@Controller('Categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}
  @Get()
  getCategories(@Query() params: FilterOptionsDto) {
    return this.categoriesService.findAll(params);
  }
  @Get('/:id')
  getCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }
  @Post()
  createCategory(@Body() payload: CreateCategoryDto) {
    return this.categoriesService.createOne(payload);
  }
  @Put('/:id')
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateOne(id, payload);
  }
  @Delete('/:id')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.deleteOne(id);
  }
}
