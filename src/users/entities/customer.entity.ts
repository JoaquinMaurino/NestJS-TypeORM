import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  OneToMany
} from 'typeorm';

import { User } from './user.entity';
import { Order } from './order.entity';

@Entity({name: 'customers'})
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updateAt: Date;

  //Relacion 1 a 1 bidireccional, se aclara que es user que tiene el campo customer
  @OneToOne(() => User, (user) => user.customer, {nullable: true})
  user: User;

  @OneToMany(()=>Order, (order)=> order.customer)
  orders: Order[]
}
