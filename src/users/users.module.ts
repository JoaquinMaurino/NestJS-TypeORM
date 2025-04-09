import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomersController } from './controllers/customers.controller';
import { CustomersService } from './services/customers.service';
import { Customer } from './entities/customer.entity';

import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User } from './entities/user.entity';

import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { Order } from './entities/order.entity';

import { OrderItemController } from './controllers/order-detail.controller';
import { OrderDetailService } from './services/order-detail.service';
import { OrderDetail } from './entities/order-detail.entity';

import { JwtModule } from '@nestjs/jwt';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([User, Customer, Order, OrderDetail, Product]),
  ],
  controllers: [
    CustomersController,
    UsersController,
    OrdersController,
    OrderItemController,
  ],
  providers: [
    CustomersService,
    UsersService,
    OrdersService,
    OrderDetailService,
  ],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
