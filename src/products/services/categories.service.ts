import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { Category } from '../entities/category.entity';
import { FilterOptionsDto } from '../../common/filter-options.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}
  async findAll(params: FilterOptionsDto): Promise<Category[]> {
    try {
      const { limit, offset } = params;
      const Categorys: Category[] = await this.categoryRepo.find({
        take: limit,
        skip: offset,
      });
      return Categorys;
    } catch (error) {
      throw new Error(`Failed to fetch Categories - Error: ${error}`);
    }
  }

  async findOne(id: number): Promise<Category> {
    const Category: Category | null = await this.categoryRepo.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!Category) {
      throw new NotFoundException(`Category with ID: ${id} not found`);
    }
    return Category;
  }

  async createOne(data: CreateCategoryDto): Promise<Category> {
    try {
      const newCategory: Category = this.categoryRepo.create(data);
      await this.categoryRepo.save(newCategory);
      return newCategory;
    } catch (error) {
      throw new Error(`Failed to create Category - Error: ${error}`);
    }
  }

  async deleteOne(id: number): Promise<{ message: string; data: Category }> {
    try {
      const category: Category = await this.findOne(id);
      await this.categoryRepo.delete(id);
      return {
        message: 'Category deleted successfully',
        data: category,
      };
    } catch (error) {
      throw new Error(`Failed to delete Category - Error: ${error}`);
    }
  }

  async updateOne(id: number, data: UpdateCategoryDto): Promise<Category> {
    try {
      const Category: Category = await this.findOne(id);
      const updatedCategory: Category = this.categoryRepo.merge(Category, data);
      await this.categoryRepo.save(updatedCategory);
      return updatedCategory;
    } catch (error) {
      throw new Error(`Failed to update Category - Error: ${error}`);
    }
  }
}
