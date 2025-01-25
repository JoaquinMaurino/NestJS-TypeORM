import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../entities/product.entity'
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { generateId } from '../../common/generate-id'

@Injectable()
export class ProductsService {

    private products: Product[] = [];

    findAll() {
        return this.products
    }

    findOne(id: number) {
        const product = this.products.find((product) => product.id === id)
        if (!product) {
            throw new NotFoundException(`Proudct with ID: ${id} not found`)
        }
        return product
    }

    createOne(payload: CreateProductDto) {
        const newProduct = {
            id: generateId(this.products),
            ...payload
        }
        this.products.push(newProduct)
        return (newProduct)
    }

    remove(id: number) {
        const product = this.findOne(id)
        if (!product) {
            throw new NotFoundException(`Proudct with ID: ${id} not found`)
        }
        this.products = this.products.filter((product) => product.id !== id)
        return {
            message: 'Product deleted successfully',
            data: product
        }
    }

    updateOne(id: number, payload: UpdateProductDto) {
        const index = this.products.findIndex((product) => product.id === id)
        if (index === -1) {
            throw new NotFoundException(`Proudct with ID: ${id} not found`)
        }
        this.products[index] = {
            ...this.products[index],
            ...payload
        }
        return this.products[index]

    }
}
