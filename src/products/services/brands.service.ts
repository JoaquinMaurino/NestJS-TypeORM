import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';
import { Brand } from '../entities/brand.entity';
import { FilterOptionsDto } from 'src/common/filter-options.dto';

@Injectable()
export class BrandsService {
  constructor(@InjectRepository(Brand) private brandRepo: Repository<Brand>) {}

  async findAll(params: FilterOptionsDto): Promise<Brand[]> {
    try {
      const {limit, offset} = params;
      const Brands: Brand[] = await this.brandRepo.find({
        take: limit,
        skip: offset,
      });
      return Brands;
    } catch (error) {
      throw new Error(`Failed to fetch Brands - Error: ${error}`);
    }
  }

  async findOne(id: number): Promise<Brand> {
    const Brand: Brand | null = await this.brandRepo.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!Brand) {
      throw new NotFoundException(`Brand with ID: ${id} not found`);
    }
    return Brand;
  }

  async createOne(data: CreateBrandDto): Promise<Brand> {
    try {
      const newBrand: Brand = this.brandRepo.create(data);
      await this.brandRepo.save(newBrand);
      return newBrand;
    } catch (error) {
      throw new Error(`Failed to create Brand - Error: ${error}`);
    }
  }

  async deleteOne(id: number): Promise<{ message: string; data: Brand }> {
    try {
      const Brand: Brand = await this.findOne(id);
      await this.brandRepo.delete(id);
      return {
        message: 'Brand deleted successfully',
        data: Brand,
      };
    } catch (error) {
      throw new Error(`Failed to delete Brand - Error: ${error}`);
    }
  }

  async updateOne(id: number, data: UpdateBrandDto): Promise<Brand> {
    try {
      const Brand: Brand = await this.findOne(id);
      const updatedBrand: Brand = this.brandRepo.merge(Brand, data);
      await this.brandRepo.save(updatedBrand);
      return updatedBrand;
    } catch (error) {
      throw new Error(`Failed to update Brand - Error: ${error}`);
    }
  }
}
