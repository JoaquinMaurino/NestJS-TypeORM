import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';
import { FilterOptionsDto } from '../../common/filter-options.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
  ) {}

  async findAll(params: FilterOptionsDto) {
    try {
      const { limit, offset } = params;
      const customers = await this.customerRepo.find({
        take: limit,
        skip: offset,
      });
      return customers;
    } catch (error) {
      throw new Error(`Failed to fetch customers: Error => ${error}`);
    }
  }

  async findOne(id: number) {
    try {
      const customer = await this.customerRepo.findOne({
        where: { id },
        relations: ['orders.orderDetail.product'],
      });
      if (!customer) {
        throw new NotFoundException(`Customer with ID: ${id} not found`);
      }
      return customer;
    } catch (error) {
      throw new Error(`Failed to fetch customer: Error => ${error}`);
    }
  }

  async createOne(data: CreateCustomerDto) {
    try {
      const newCustomer = await this.customerRepo.create(data);
      await this.customerRepo.save(newCustomer);
      return newCustomer;
    } catch (error) {
      throw new Error(`Failed to create customer: Error => ${error}`);
    }
  }

  async deleteOne(id: number) {
    try {
      const customer = await this.findOne(id);
      await this.customerRepo.delete(id);
      return {
        message: 'customer deleted successfully',
        data: customer,
      };
    } catch (error) {
      throw new Error(`Failed to delete customer: Error => ${error}`);
    }
  }

  async updateOne(id: number, data: UpdateCustomerDto) {
    try {
      const customer = await this.customerRepo.findOneBy({ id });
      if (!customer) {
        throw new NotFoundException(`Customer with id ${id} not found`);
      }
      const updatedCustomer = this.customerRepo.merge(customer, data);
      await this.customerRepo.save(updatedCustomer);
      return {
        message: 'Customer updated successfully',
        data: updatedCustomer,
      };
    } catch (error) {
      throw new Error(`Failed to update customer - Error: ${error}`);
    }
  }
}
