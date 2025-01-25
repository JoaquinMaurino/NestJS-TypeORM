import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ParseIntPipe } from 'src/common/parse-int.pipe';
import { CreateBrandDto, UpdateBrandDto } from 'src/dtos/brand.dto';
import { BrandsService } from 'src/services/brands.service';

@Controller('brands')
export class BrandsController {
    constructor(private brandsService: BrandsService) { }
    @Get()
    getBrands() {
        return this.brandsService.findAll()
    }
    @Get('/:id')
    getBrand(@Param('id', ParseIntPipe) id: number) {
        return this.brandsService.findOne(id)
    }
    @Post()
    createBrand(@Body() payload: CreateBrandDto) {
        return this.brandsService.createOne(payload)
    }
    @Put('/:id')
    updateBrand(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateBrandDto) {
        return this.brandsService.updateOne(id, payload)
    }
    @Delete('/:id')
    deleteBrand(@Param('id', ParseIntPipe) id: number) {
        return this.brandsService.remove(id)
    }
}
