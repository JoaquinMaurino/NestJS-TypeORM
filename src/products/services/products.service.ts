import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepo.find(); // No await, retorna directamente una promesa
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Proudct with ID: ${id} not found`);
    }
    return product;
  }

  async createOne(data: CreateProductDto): Promise<Product> {
    try {
      const newProduct = this.productRepo.create(data);
      await this.productRepo.save(newProduct);
      return newProduct;
    } catch (error) {
      throw new Error(`Failed to create product: Error => ${error}`);
    }
  }

  async updateOne(id: number, data: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Proudct with ID: ${id} not found`);
    }
    const updatedProduct = this.productRepo.merge(product, data);
    await this.productRepo.save(updatedProduct);
    return updatedProduct
  }

  async deleteOne(id: number): Promise<Product> {
    const product = await this.findOne(id);
    await this.productRepo.delete(id);
    return product;
  }
}
