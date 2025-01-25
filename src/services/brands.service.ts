import { Injectable, NotFoundException } from '@nestjs/common';
import { generateId } from '../common/generate-id'
import { Brand } from 'src/entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from 'src/dtos/brand.dto';


@Injectable()
export class BrandsService {

    private brands: Brand[] = []

    findAll() {
        return this.brands
    }

    findOne(id: number) {
        const brand = this.brands.find((brand) => brand.id === id)
        if (!brand) {
            throw new NotFoundException(`Brand with ID: ${id} not found`)
        }
        return brand
    }

    createOne(payload: CreateBrandDto) {
        const newbrand = {
            id: generateId(this.brands),
            ...payload
        }
        this.brands.push(newbrand)
        return (newbrand)
    }

    remove(id: number) {
        const brand = this.findOne(id)
        if (!brand) {
            throw new NotFoundException(`Brand with ID: ${id} not found`)
        }
        this.brands = this.brands.filter((brand) => brand.id !== id)
        return {
            message: 'brand deleted successfully',
            data: brand
        }
    }

    updateOne(id: number, payload: UpdateBrandDto) {
        const index = this.brands.findIndex((brand) => brand.id === id)
        if (index === -1) {
            throw new NotFoundException(`Brand with ID: ${id} not found`)
        }
        this.brands[index] = {
            ...this.brands[index],
            ...payload
        }
        return this.brands[index]

    }
}
