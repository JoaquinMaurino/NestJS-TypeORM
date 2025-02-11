import { Test, TestingModule } from '@nestjs/testing';

import { ProductsController } from '../../../../src/products/controllers/products.controller';
import { ProductsService } from '../../../../src/products/services/products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockId = 1;
  const mockData = {
    name: 'Product',
    description: 'Product',
    price: 1,
    stock: 1,
    image: 'image.com',
  };
  const mockProduct = {
    mockId,
    ...mockData,
  };
  const mockProducts = [mockProduct];

  beforeEach(async () => {
    const mockService = {
      findAll: jest.fn().mockResolvedValue(mockProducts),
      findOne: jest.fn().mockResolvedValue(mockProduct),
      createOne: jest.fn().mockResolvedValue(mockProduct),
      updateOne: jest.fn().mockResolvedValue(mockProduct),
      deleteOne: jest.fn().mockResolvedValue(mockProduct),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: mockService }],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return a list of products', async () => {
      const result = await controller.getProducts();
      expect(result).toEqual(mockProducts);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });
  describe('getById', () => {
    it('should return a list of products', async () => {
      const result = await controller.getById(mockId);
      expect(result).toEqual(mockProduct);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });
  describe('createOne', () => {
    it('should create a product', async () => {
      const result = await controller.createProduct(mockData);
      expect(result).toEqual(mockProduct);
      expect(service.createOne).toHaveBeenCalledTimes(1);
    });
  });
  describe('updateOne', () => {
    it('should update a product by id', async () => {
      const result = await controller.updateProduct(mockId, mockData);
      expect(result).toEqual(mockProduct);
      expect(service.updateOne).toHaveBeenCalledTimes(1);
    });
  });
  describe('deleteOne', () => {
    it('should create a product', async () => {
      const result = await controller.deleteProduct(mockId);
      expect(result).toEqual(mockProduct);
      expect(service.deleteOne).toHaveBeenCalledTimes(1);
    });
  });
});
