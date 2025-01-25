import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { UsersController } from './controllers/users.controller';
import { BrandsController } from './controllers/brands.controller';
import { CustomersController } from './controllers/customers.controller';
import { CategoriesController } from './controllers/categories.controller';
import { UsersService } from './services/users.service';
import { BrandsService } from './services/brands.service';
import { CustomersService } from './services/customers.service';
import { CategoriesService } from './services/categories.service';


@Module({
  imports: [],
  controllers: [AppController, ProductsController, UsersController, BrandsController, CustomersController, CategoriesController],
  providers: [AppService, ProductsService, UsersService, BrandsService, CustomersService, CategoriesService],
})
export class AppModule {}
