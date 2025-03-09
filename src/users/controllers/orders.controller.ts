import {
  Controller,
  Body,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OrdersService } from '../services/orders.service';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';
import { ParseIntPipe } from '../../common/parse-int.pipe';

import { FilterOptionsDto } from '../../common/filter-options.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}
  @Get()
  async getOrders(@Query() params: FilterOptionsDto) {
    return this.ordersService.findAll(params);
  }

  @Get(':id')
  async getOrder(@Param('id', ParseIntPipe) id: number) {
    return await this.ordersService.findOne(id);
  }

  @Post()
  async createOrder(@Body() data: CreateOrderDto) {
    return this.ordersService.createOrder(data);
  }

  @Put(':id')
  async updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateOrderDto,
  ) {
    return await this.ordersService.updateOrder(id, data);
  }

  @Delete(':id')
  async deleteOrder(@Param('id', ParseIntPipe) id: number) {
    return await this.ordersService.deleteOne(id);
  }
}
