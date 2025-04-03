import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { ParseIntPipe } from '../../common/parse-int.pipe';
import { ProductsService } from '../services/products.service';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { FilterOptionsDto } from '../../common/filter-options.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/models/roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public()
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

  @Roles(Role.ADMIN)
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
