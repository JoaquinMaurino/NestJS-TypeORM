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
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });
  });
  describe('getById', () => {
    it('should return a list of products', async () => {
      const result = await controller.getById(mockId);
      expect(service.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });
  });
  describe('createOne', () => {
    it('should create a product', async () => {
      const result = await controller.createProduct(mockData);
      expect(service.createOne).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });
  });
  describe('updateOne', () => {
    it('should update a product by id', async () => {
      const result = await controller.updateProduct(mockId, mockData);
      expect(service.updateOne).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });
  });
  describe('deleteOne', () => {
    it('should create a product', async () => {
      const result = await controller.deleteProduct(mockId);
      expect(service.deleteOne).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });
  });
});
