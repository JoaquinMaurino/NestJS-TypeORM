import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Between, FindOptionsWhere } from 'typeorm';

import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';

import { FilterOptionsDto } from '../../common/filter-options.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
  ) {}

  async findAll(params?: FilterOptionsDto): Promise<Product[]> {
    try {
      const where: FindOptionsWhere<Product> = {};
      if (params) {
        const { limit, offset, minPrice, maxPrice, brandId } = params;
        if (minPrice && maxPrice) {
          where.price = Between(minPrice, maxPrice);
        }
        if (brandId) {
          where.brand = { id: brandId };
        }
      }
      return await this.productRepo.find({
        take: params?.limit,
        skip: params?.offset,
        where,
        relations: ['brand'],
      }); // No await, retorna directamente una promesa
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['brand', 'categories'],
    });
    if (!product) {
      throw new NotFoundException(`Proudct with ID: ${id} not found`);
    }
    return product;
  }

  async createOne(
    data: CreateProductDto,
  ): Promise<Product | { status: number; message: string }> {
    try {
      //Verificar si ya existe
      const existingProduct = await this.productRepo.findOne({
        where: { name: data.name },
      });
      if (existingProduct) {
        return Promise.resolve({
          status: 409,
          message: `Product with name '${data.name}' already exists, try another one`,
        });
      }
      //Crear el producto
      const newProduct = this.productRepo.create(data);
      //Asignarle la marca
      if (data.brandId) {
        const brand = await this.brandRepo.findOneBy({ id: data.brandId });
        brand && (newProduct.brand = brand);
      }
      if (data.categoriesIds) {
        const categories = await this.categoryRepo.findBy({
          id: In(data.categoriesIds),
        });
        newProduct.categories = categories;
      }
      //Guardarlo en la base de datos
      await this.productRepo.save(newProduct);
      return newProduct;
    } catch (error) {
      throw new Error(`Failed to create product: Error => ${error}`);
    }
  }

  async updateOne(
    id: number,
    data: UpdateProductDto,
  ): Promise<{ message: string; data: Product }> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product ${id} not founf`);
    }
    if (data.brandId) {
      const brand = await this.brandRepo.findOneBy({ id: data.brandId });
      brand && (product.brand = brand);
    }
    if (data.categoriesIds) {
      const categories = await this.categoryRepo.findBy({
        id: In(data.categoriesIds),
      });
      product.categories = categories;
    }
    const updatedProduct = this.productRepo.merge(product, data);
    await this.productRepo.save(updatedProduct);
    return {
      message: 'Product updated successfully',
      data: product,
    };
  }

  async deleteCategory(prodId: number, catId: number) {
    try {
      const product = await this.productRepo.findOne({
        where: { id: prodId },
        relations: ['categories'],
      });
      if (!product) {
        throw new NotFoundException(`Product with ID: ${prodId} not found`);
      }
      product.categories = product.categories.filter((cat) => cat.id !== catId);
      await this.productRepo.save(product);
      return {
        message: `Category ${catId} removed successfully from Product ${prodId}`,
        data: product,
      };
    } catch (error) {
      throw new Error(
        `Failed to remove category from product: Error => ${error}`,
      );
    }
  }
  async addCategory(prodId: number, catId: number) {
    try {
      const [product, category] = await Promise.all([
        this.productRepo.findOne({
          where: { id: prodId },
          relations: ['categories'],
        }),
        this.categoryRepo.findOneBy({ id: catId }),
      ]);
      if (!product || !category) {
        throw new NotFoundException(
          `Not found: ${!product ? `Product ${prodId}` : ''} ${!category ? `Category ${catId}` : ''}`.trim(),
        );
      }
      if (!product.categories.some((cat) => cat.id === catId)) {
        product.categories.push(category);
        await this.productRepo.save(product);
        return {
          message: `Category ${catId} added successfully to Product ${prodId}`,
          data: product,
        };
      }
      return {
        success: false,
        message: `Category ${catId} already existis in Product ${prodId}, please try another one`,
      };
    } catch (error) {
      throw new Error(`Failed to add category to product: Error => ${error}`);
    }
  }

  async deleteOne(id: number) {
    const product = await this.findOne(id);
    await this.productRepo.delete(id);
    return {
      message: 'User deleted successfully',
      data: product,
    };
  }
}
