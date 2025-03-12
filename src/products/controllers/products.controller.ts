import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ProductsService } from '../services/products.service';
import { ParseIntPipe } from '../../common/parse-int.pipe';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../dtos/product.dto';

import { FilterOptionsDto } from '../../common/filter-options.dto';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all products' })
  async getProducts(@Query() params: FilterOptionsDto) {
    return await this.productsService.findAll(params);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Fetch single product by ID' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a single product' })
  async createProduct(@Body() data: CreateProductDto) {
    return await this.productsService.createOne(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing product by ID' })
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProductDto,
  ) {
    return await this.productsService.updateOne(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing product by ID' })
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.deleteOne(id);
  }

  //Endpoints destinados a la modificacion del array categories de un producto
  @Delete(':prodId/category/:catId')
  async deleteCategory(
    @Param('prodId', ParseIntPipe) prodId: number,
    @Param('catId', ParseIntPipe) catId: number,
  ) {
    return await this.productsService.deleteCategory(prodId, catId);
  }
  @Put(':prodId/category/:catId')
  async addCategory(
    @Param('prodId', ParseIntPipe) prodId: number,
    @Param('catId', ParseIntPipe) catId: number,
  ) {
    return await this.productsService.addCategory(prodId, catId);
  }
}
