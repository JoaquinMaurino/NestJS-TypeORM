import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import { Customer } from './customer.entity';
import { OrderDetail } from './order-detail.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updateAt: Date;

  @Exclude()
  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @Exclude()
  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetail: OrderDetail[];

  @Expose()
  get customerName() {
    return this.customer
      ? `${this.customer.firstName} ${this.customer.lastName}`
      : '';
  }

  @Expose()
  get products() {
    if (this.orderDetail) {
      return this.orderDetail
        .filter((detail) => !!detail)
        .map((detail) => {
          const totalItem = detail.product.price * detail.quantity;
          return {
            itemId: detail.id,
            prodId: detail.product.id,
            name: detail.product.name,
            price: detail.product.price,
            quantity: detail.quantity,
            total: totalItem,
          };
        });
    }
    return [];
  }

  @Expose()
  get totalOrder() {
    if (this.orderDetail) {
      return this.orderDetail
        .filter((detail) => !!detail)
        .reduce((total, detail) => {
          const totalItem = detail.product.price * detail.quantity;
          return total + totalItem;
        }, 0); // el segundo prametro es el valor inicial del acumlador, inicia en 0
    }
    return 0;
  }
}
