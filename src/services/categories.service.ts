import { Injectable, NotFoundException } from '@nestjs/common';
import { generateId } from '../common/generate-id'
import { Category } from 'src/entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/dtos/category.dto';


@Injectable()
export class CategoriesService {

    private categories: Category[] = []

    findAll() {
        return this.categories
    }

    findOne(id: number) {
        const category = this.categories.find((category) => category.id === id)
        if (!category) {
            throw new NotFoundException(`Category with ID: ${id} not found`)
        }
        return category
    }

    createOne(payload: CreateCategoryDto) {
        const newCategory = {
            id: generateId(this.categories),
            ...payload
        }
        this.categories.push(newCategory)
        return (newCategory)
    }

    remove(id: number) {
        const category = this.findOne(id)
        if (!category) {
            throw new NotFoundException(`Category with ID: ${id} not found`)
        }
        this.categories = this.categories.filter((category) => category.id !== id)
        return {
            message: 'category deleted successfully',
            data: category
        }
    }

    updateOne(id: number, payload: UpdateCategoryDto) {
        const index = this.categories.findIndex((category) => category.id === id)
        if (index === -1) {
            throw new NotFoundException(`Category with ID: ${id} not found`)
        }
        this.categories[index] = {
            ...this.categories[index],
            ...payload
        }
        return this.categories[index]

    }
}
