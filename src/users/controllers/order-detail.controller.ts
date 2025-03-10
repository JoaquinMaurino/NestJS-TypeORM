import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OrderDetailService } from '../services/order-detail.service';
import { CreateOrderDetailDto } from '../dtos/order-detail.dto';
import { ParseIntPipe } from 'src/common/parse-int.pipe';

import { FilterOptionsDto } from '../../common/filter-options.dto';

@ApiTags('Order Detail')
@Controller('order-detail')
export class OrderItemController {
  constructor(private orderItemService: OrderDetailService) {}

  @Get()
  async getOrderItems(@Query() params: FilterOptionsDto) {
    return await this.orderItemService.findAll(params);
  }

  @Get(':id')
  async getOrderItem(@Param('id', ParseIntPipe) id: number) {
    return await this.orderItemService.findOne(id);
  }

  @Post()
  async createOrderItem(@Body() data: CreateOrderDetailDto) {
    return await this.orderItemService.createOrderDetail(data);
  }

  @Delete(':id')
  async deleteOrderItem(@Param('id', ParseIntPipe) id: number) {
    return await this.orderItemService.deleteOrderDetail(id);
  }
}
