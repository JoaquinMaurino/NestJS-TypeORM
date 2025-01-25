import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    HttpCode,
    HttpStatus
} from '@nestjs/common';
import { ProductsService } from '../services/products.service'
import { ParseIntPipe } from '../../common/parse-int.pipe'
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto'

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }
    @Get()
    getProducts(
        @Query('limit') limit: number = 10,
        @Query('offset') offset: number = 0,
        @Query('brande') brand: string) {
        //return { message: `Products of brand: ${brand} limit: ${limit} - Offset: ${offset}` }
        return this.productsService.findAll()
    }
    @Get('/:id')
    @HttpCode(HttpStatus.ACCEPTED)
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.findOne(id)
    }

    @Post()
    createProduct(@Body() payload: CreateProductDto) {
        return this.productsService.createOne(payload)
    }

    @Put(':id')
    updateProduct(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateProductDto) {
        return this.productsService.updateOne(id, payload)
    }

    @Delete(':id')
    deleteProduct(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.remove(id)
    }
}
