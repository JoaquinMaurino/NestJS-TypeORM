import { ConfigService } from '@nestjs/config';
import { Injectable, NotFoundException } from '@nestjs/common';
import { generateId } from '../../common/generate-id'
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { ProductsService } from '../../products/services/products.service'


@Injectable()
export class UsersService {
    constructor(
        private productService: ProductsService,
        private configService: ConfigService,
    ) { }
    private users: User[] = []

    findAll() {
        const apiKey = this.configService.get('API_KEY');
        const myDb = this.configService.get('DATABASE');
        console.log(`API KEY: ${apiKey} - Database: ${myDb}`);

        return this.users
    }

    findOne(id: number) {
        const user = this.users.find((user) => user.id === id)
        if (!user) {
            throw new NotFoundException(`User with ID: ${id} not found`)
        }
        return user
    }

    createOne(payload: CreateUserDto) {
        const newUser = {
            id: generateId(this.users),
            ...payload
        }
        this.users.push(newUser)
        return (newUser)
    }

    remove(id: number) {
        const user = this.findOne(id)
        if (!user) {
            throw new NotFoundException(`User with ID: ${id} not found`)
        }
        this.users = this.users.filter((user) => user.id !== id)
        return {
            message: 'Product deleted successfully',
            data: user
        }
    }

    updateOne(id: number, payload: UpdateUserDto) {
        const index = this.users.findIndex((user) => user.id === id)
        if (index === -1) {
            throw new NotFoundException(`User with ID: ${id} not found`)
        }
        this.users[index] = {
            ...this.users[index],
            ...payload
        }
        return this.users[index]

    }

    //Orders method
    getUserOrders(id: number): Order {
        const user = this.findOne(id)
        const newOrder: Order = {
            date: new Date(),
            user,
            products: this.productService.findAll()
        }
        return newOrder;
    }
}
