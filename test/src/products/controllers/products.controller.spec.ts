import { Test, TestingModule } from '@nestjs/testing';

import { ProductsController } from '../../../../src/products/controllers/products.controller';
import { ProductsService } from '../../../../src/products/services/products.service';
import { Product } from '../../../../src/products/entities/product.entity';
import { CreateProductDto } from '../../../../src/products/dtos/product.dto';

import { FilterOptionsDto } from '../../../../src/common/filter-options.dto';
import { RolesGuard } from '../../../../src/auth/guards/roles.guard';
import { JwtAuthGuard } from '../../../../src/auth/guards/jwt-auth.guard';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  //Mock de los guards
  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };
  const mockRolesGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockProdId = 1;
  const mockCatId = 1;

  const mockCreateProdData: CreateProductDto = {
    name: 'Product',
    description: 'Product',
    price: 1,
    stock: 1,
    image: 'image.com',
    brandId: 1,
    categoriesIds: [1],
  };
  const mockProduct: Partial<Product> = {
    id: mockProdId,
    ...mockCreateProdData,
    updateAt: expect.any(Date),
    createAt: expect.any(Date),
  };
  const mockProducts = [mockProduct];

  //Mock del service
  const mockService = {
    findAll: jest.fn().mockResolvedValue(mockProducts),
    findOne: jest.fn().mockResolvedValue(mockProduct),
    createOne: jest.fn().mockResolvedValue(mockProduct),
    updateOne: jest.fn().mockResolvedValue(mockProduct),
    deleteOne: jest.fn().mockResolvedValue(mockProduct),
    deleteCategory: jest.fn().mockResolvedValue({
      message: `Category deleted successfully`,
      data: { ...mockProduct, categoriesIds: [] },
    }),
    addCategory: jest.fn().mockResolvedValue({
      message: `Category added successfully`,
      data: { ...mockProduct, categoriesIds: [1, 2] },
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return a list of products', async () => {
      const params: FilterOptionsDto = {
        limit: 0,
        offset: 0,
        minPrice: 0,
        maxPrice: 0,
        brandId: 1,
      };
      const result = await controller.getProducts(params);
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });
  });
  describe('getById', () => {
    it('should return a list of products', async () => {
      const result = await controller.getById(mockProdId);
      expect(service.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });
  });
  describe('createOne', () => {
    it('should create a product', async () => {
      const result = await controller.createProduct(mockCreateProdData);
      expect(service.createOne).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });
  });
  describe('updateOne', () => {
    it('should update a product by id', async () => {
      const result = await controller.updateProduct(
        mockProdId,
        mockCreateProdData,
      );
      expect(service.updateOne).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });
  });
  describe('deleteOne', () => {
    it('should create a product', async () => {
      const result = await controller.deleteProduct(mockProdId);
      expect(service.deleteOne).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });
  });

  describe('deleteCategory', () => {
    it('should remove a category from the product', async () => {
      const product = {
        ...mockProduct,
        categoriesIds: [],
      };
      const result = await controller.deleteCategory(mockProdId, mockCatId);
      expect(service.deleteCategory).toHaveBeenCalled();
      expect(result).toEqual({
        message: `Category deleted successfully`,
        data: product,
      });
    });
  });
  describe('addCategory', () => {
    it('should add a category to the product', async () => {
      const product = {
        ...mockProduct,
        categoriesIds: [1, 2],
      };
      const result = await controller.addCategory(mockProdId, mockCatId);
      expect(service.addCategory).toHaveBeenCalled();
      expect(result).toEqual({
        message: `Category added successfully`,
        data: product,
      });
    });
  });
});
