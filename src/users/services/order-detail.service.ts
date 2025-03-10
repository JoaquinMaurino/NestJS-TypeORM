import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderDetail } from '../entities/order-detail.entity';
import { CreateOrderDetailDto } from '../dtos/order-detail.dto';

import { Product } from '../../products/entities/product.entity';
import { Order } from '../entities/order.entity';

import { FilterOptionsDto } from '../../common/filter-options.dto';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailRepo: Repository<OrderDetail>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
  ) {}

  async findAll(params: FilterOptionsDto) {
    try {
      const { limit, offset } = params;
      const ordersItems = await this.orderDetailRepo.find({
        take: limit,
        skip: offset,
      });
      return ordersItems;
    } catch (error) {
      throw new Error('Failed to fetch order detail');
    }
  }

  async findOne(id: number) {
    try {
      const orderItem = await this.orderDetailRepo.findOne({
        where: { id },
        relations: ['product', 'order'],
      });
      if (!orderItem) {
        throw new NotFoundException(`Order Item ${id} not found`);
      }
      return orderItem;
    } catch (error) {
      throw new Error('Failed to fetch order detail');
    }
  }

  async createOrderDetail(data: CreateOrderDetailDto) {
    try {
      const [product, order] = await Promise.all([
        this.productRepo.findOneBy({ id: data.prodId }),
        this.orderRepo.findOne({ 
          where: {id: data.orderId},
          relations: ['customer', 'orderDetail.product']
        }),
      ]);
      if (!product || !order) {
        throw new NotFoundException(
          `Not found: ${!product ? `Product ${data.prodId}` : ''} ${!order ? `Category ${data.orderId}` : ''}`.trim(),
        );
      }
      const newOrderItem = this.orderDetailRepo.create({
        order,
        product,
        quantity: data.quantity ?? 1, //Si quantity no se envia, es decir es null, se asigna 1
      });
      await this.orderDetailRepo.save(newOrderItem);
      return newOrderItem;
    } catch (error) {
      throw new Error('Failed to create and save order detail');
    }
  }

  async deleteOrderDetail(id: number) {
    try {
      const orderDetail = await this.orderDetailRepo.findOneBy({ id });
      if (!orderDetail) {
        throw new NotFoundException(`Order detail with id ${id} not found`);
      }
      await this.orderDetailRepo.delete(id);
      return {
        message: 'Order detail deleted successfully',
        data: orderDetail,
      };
    } catch (error) {
      throw new Error('Failed to delete order detail');
    }
  }
}
