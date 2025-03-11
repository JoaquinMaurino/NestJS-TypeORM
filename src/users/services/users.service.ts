import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

import { CustomersService } from './customers.service';
import { FilterOptionsDto } from '../../common/filter-options.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private customersService: CustomersService,
  ) {}

  async findAll(params: FilterOptionsDto): Promise<User[]> {
    try {
      const { limit, offset } = params;
      const users: User[] = await this.userRepo.find({
        relations: ['customer'],
        take: limit,
        skip: offset,
      });
      return users;
    } catch (error) {
      throw new Error(`Failed to fetch users - Error: ${error}`);
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user: User | null = await this.userRepo.findOne({
        where: { id },
        relations: ['customer'],
      });
      if (!user) {
        throw new NotFoundException(`User with ID: ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new Error('Failed to fetch user');
    }
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async createOne(data: CreateUserDto): Promise<User> {
    try {
      const newUser: User = this.userRepo.create(data);
      const hashPassword = await bcrypt.hash(newUser.password, 10);
      newUser.password = hashPassword;
      if (data.customerId) {
        const customer = await this.customersService.findOne(data.customerId);
        newUser.customer = customer;
      }
      await this.userRepo.save(newUser);
      return newUser;
    } catch (error) {
      throw new Error(`Failed to create user - Error: ${error}`);
    }
  }

  async deleteOne(id: number): Promise<{ message: string; data: User }> {
    try {
      const user: User = await this.findOne(id);
      await this.userRepo.delete(id);
      return {
        message: 'User deleted successfully',
        data: user,
      };
    } catch (error) {
      throw new Error(`Failed to delete user - Error: ${error}`);
    }
  }

  async updateOne(id: number, data: UpdateUserDto): Promise<User> {
    try {
      const user: User = await this.findOne(id);
      const updatedUser: User = this.userRepo.merge(user, data);
      await this.userRepo.save(updatedUser);
      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update user - Error: ${error}`);
    }
  }

  /*   //Orders method
  async getUserOrders(id: number) {
    try {
      const user: User = await this.findOne(id);
      const products: Product[] = await this.productService.findAll();
      const newOrder = new Order();
      return newOrder;
    } catch (error) {
      throw new Error(`Failed to fetch user orders - Error: ${error}`);
    }
  } */
}