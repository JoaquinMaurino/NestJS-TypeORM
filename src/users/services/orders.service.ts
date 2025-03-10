import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from '../entities/order.entity';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';

import { Customer } from '../entities/customer.entity';
import { FilterOptionsDto } from '../../common/filter-options.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepo: Repository<Order>,
    @InjectRepository(Customer) private customersRepo: Repository<Customer>,
  ) {}

  async findAll(params: FilterOptionsDto): Promise<Order[]> {
    try {
      const { limit, offset } = params;
      const orders = await this.ordersRepo.createQueryBuilder('order')
      .leftJoinAndSelect('order.orderDetail', 'orderDetail')
      .leftJoinAndSelect('orderDetail.product', 'product')
      .leftJoinAndSelect('order.customer', 'customer')
      .take(limit)
      .skip(offset)
      .getMany()
      return orders;
    } catch (error) {
      throw new Error(`Failed to fetch orders - Error: ${error}`);
    }
  }
/*   async findAll(params: FilterOptionsDto): Promise<Order[]> {
    try {
      const { limit, offset } = params;
      const orders = await this.ordersRepo.find({
        take: limit,
        skip: offset,
        relations: ['orderDetail.product'],
      });
      return orders;
    } catch (error) {
      throw new Error('Failed to fetch orders');
    }
  } */

  async findOne(id: number): Promise<Order> {
    try {
      const order = await this.ordersRepo.findOne({
        where: { id },
        relations: ['customer', 'orderDetail', 'orderDetail.product'],
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      return order;
    } catch (error) {
      throw new Error('Failed to fetch order');
    }
  }

  async createOrder(data: CreateOrderDto): Promise<Order> {
    try {
      const newOrder = new Order();
      if (data.customerId) {
        const customer = await this.customersRepo.findOneBy({
          id: data.customerId,
        });
        customer && (newOrder.customer = customer);
      }
      await this.ordersRepo.save(newOrder);
      return newOrder;
    } catch (error) {
      throw new Error(`Failed to create order - Error: ${error}`);
    }
  }

  async updateOrder(id: number, data: UpdateOrderDto): Promise<Order> {
    try {
      const order = await this.findOne(id);
      if (data.customerId) {
        const customer = await this.customersRepo.findOneBy({
          id: data.customerId,
        });
        customer && (order.customer = customer);
      }
      await this.ordersRepo.save(order);
      return order;
    } catch (error) {
      throw new Error('Failed to fetch orders');
    }
  }

  async deleteOne(id: number): Promise<{ message: string; data: Order }> {
    try {
      const order = await this.findOne(id);
      await this.ordersRepo.delete(id);
      return {
        message: 'Order deleted successfully',
        data: order,
      };
    } catch (error) {
      throw new Error('Failed to fetch orders');
    }
  }
}
