import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { ProductsService } from '../services/products.service';
import { ParseIntPipe } from '../../common/parse-int.pipe';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all products' })
  getProducts() {
    //return { message: `Products of brand: ${brand} limit: ${limit} - Offset: ${offset}` }
    return this.productsService.findAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Fetch single product by ID' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a single product' })
  createProduct(@Body() data: CreateProductDto) {
    return this.productsService.createOne(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing product by ID' })
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProductDto,
  ) {
    return this.productsService.updateOne(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing product by ID' })
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteOne(id);
  }
}
