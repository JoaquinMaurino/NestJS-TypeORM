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
      const categories: Category[] = await this.categoryRepo.find({
        take: limit,
        skip: offset,
      });
      return categories;
    } catch (error) {
      throw new Error(`Failed to fetch Categories - Error: ${error}`);
    }
  }

  async findOne(id: number): Promise<Category> {
    const category: Category | null = await this.categoryRepo.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID: ${id} not found`);
    }
    return category;
  }

  async createOne(data: CreateCategoryDto): Promise<Category> {
    const newCategory: Category = this.categoryRepo.create(data);
    await this.categoryRepo.save(newCategory);
    return newCategory;
  }

  async deleteOne(id: number): Promise<{ message: string; data: Category }> {
    const category: Category | null = await this.categoryRepo.findOneBy({ id });
    if (!category) {
      throw new NotFoundException();
    }
    await this.categoryRepo.delete(id);
    return {
      message: 'Category deleted successfully',
      data: category,
    };
  }

  async updateOne(id: number, data: UpdateCategoryDto): Promise<Category> {
    const category: Category = await this.findOne(id);
    const updatedCategory: Category = this.categoryRepo.merge(category, data);
    await this.categoryRepo.save(updatedCategory);
    return updatedCategory;
  }
}
