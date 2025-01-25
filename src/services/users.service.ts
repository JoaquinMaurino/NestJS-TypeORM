import { Injectable, NotFoundException } from '@nestjs/common';
import { generateId } from '../common/generate-id'
import { User } from 'src/entities/user.entity';
import { CreateUserDto, UpdateUserDto } from 'src/dtos/user.dto';


@Injectable()
export class UsersService {

    private users: User[] = []

    findAll() {
        return this.users
    }

    findOne(id: number) {
        const product = this.users.find((product) => product.id === id)
        if (!product) {
            throw new NotFoundException(`Proudct with ID: ${id} not found`)
        }
        return product
    }

    createOne(payload: CreateUserDto) {
        const newProduct = {
            id: generateId(this.users),
            ...payload
        }
        this.users.push(newProduct)
        return (newProduct)
    }

    remove(id: number) {
        const product = this.findOne(id)
        if (!product) {
            throw new NotFoundException(`Proudct with ID: ${id} not found`)
        }
        this.users = this.users.filter((product) => product.id !== id)
        return {
            message: 'Product deleted successfully',
            data: product
        }
    }

    updateOne(id: number, payload: UpdateUserDto) {
        const index = this.users.findIndex((product) => product.id === id)
        if (index === -1) {
            throw new NotFoundException(`Proudct with ID: ${id} not found`)
        }
        this.users[index] = {
            ...this.users[index],
            ...payload
        }
        return this.users[index]

    }
}
