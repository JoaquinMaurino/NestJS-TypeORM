import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ParseIntPipe } from '../../common/parse-int.pipe';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { CategoriesService } from '../services/categories.service';


@Controller('categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) { }
    @Get()
    getCategories() {
        return this.categoriesService.findAll()
    }
    @Get('/:id')
    getCategory(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.findOne(id)
    }
    @Post()
    createCategory(@Body() payload: CreateCategoryDto) {
        return this.categoriesService.createOne(payload)
    }
    @Put('/:id')
    updateCategory(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateCategoryDto) {
        return this.categoriesService.updateOne(id, payload)
    }
    @Delete('/:id')
    deleteCategory(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.remove(id)
    }
}
