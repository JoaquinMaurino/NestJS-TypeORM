import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'


import { Product } from '../entities/product.entity'
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { generateId } from '../../common/generate-id'

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product) private productRepo: Repository<Product>
    ) { }

    async findAll(): Promise<Product[]> {
        return this.productRepo.find() // No await, retorna directamente una promesa
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.productRepo.findOneBy({ id })
        if (!product) {
            throw new NotFoundException(`Proudct with ID: ${id} not found`)
        }
        return product
    }

    async createOne(data: CreateProductDto): Promise<Product> {
        /*const newProduct = new Product();
        newProduct.name = data.name
        newProduct.description = data.description
        newProduct.price = data.price
        newProduct.stock = data.stock
        newProduct.image = data.image */
        try {
            const newProduct = this.productRepo.create(data)
            return await this.productRepo.save(newProduct)
        } catch (error) {
            throw new Error(`Failed to create product: Error => ${error}`)
        }
    }


    async updateOne(id: number, data: UpdateProductDto): Promise<Product> {
        const product = await this.productRepo.findOneBy({ id })
        if (!product) {
            throw new NotFoundException(`Proudct with ID: ${id} not found`)
        }
        this.productRepo.merge(product, data)
        return await this.productRepo.save(product);

    }

    async remove(id: number): Promise<{ message: string, data: Product }> {
        const product = await this.findOne(id);
        await this.productRepo.delete(id)
        return {
            message: 'Product deleted successfully',
            data: product
        }
    }
}
