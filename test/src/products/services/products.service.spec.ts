import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../../../../src/products/services/products.service';

import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../../../src/products/entities/product.entity';
import { CreateProductDto } from '../../../../src/products/dtos/product.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockId = 1;
  const mockData: CreateProductDto = {
    name: 'Product',
    description: 'Product',
    price: 1,
    stock: 1,
    image: 'image.com',
  };
  const mockProduct: Product = {
    id: mockId,
    ...mockData,
    updateAt: expect.any(Date),
    createAt: expect.any(Date),
  };
  const mockProducts = [mockProduct];
  const mockRepository = {
    find: jest.fn().mockResolvedValue(mockProducts),
    findOneBy: jest.fn(),
    create: jest.fn().mockResolvedValue(mockProduct),
    save: jest.fn().mockResolvedValue(mockProduct),
    merge: jest.fn().mockResolvedValue(mockProduct),
    delete: jest.fn().mockResolvedValue(mockProduct),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockProducts);
    });
  });
  describe('findOne', () => {
    it('should return a product', async () => {
      jest
        .spyOn(mockRepository, 'findOneBy')
        .mockResolvedValueOnce(mockProduct);
      const result = await service.findOne(mockId);
      expect(result).toEqual(mockProduct);
    });
    it('should throw an exception if product not found', async () => {
      await expect(service.findOne(100)).rejects.toThrow(NotFoundException);
    });
  });
  describe('createOne', () => {
    it('should create a product', async () => {
      jest.spyOn(mockRepository, 'create').mockReturnValue(mockProduct)
      jest.spyOn(mockRepository, 'save').mockResolvedValue(mockProduct)
      const result = await service.createOne(mockData);
      expect(result).toEqual(mockProduct);
    });
    it('should throw an error if save fails', async () => {
      const mockError = new Error('Database error');
      jest.spyOn(mockRepository, 'create').mockReturnValue(mockProduct)
      jest.spyOn(mockRepository, 'save').mockRejectedValueOnce(mockError);
      await expect(service.createOne(mockData)).rejects.toThrow(
        `Failed to create product: Error => ${mockError}`,
      );
    });
  });
  describe('updateOne', () => {
    it('should update a product by id', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(mockProduct);
      const result = await service.updateOne(mockId, mockData);
      expect(result).toEqual(mockProduct);
    });
    it('should throw a not found exception if product not found', async () => {
      await expect(service.findOne(100)).rejects.toThrow(NotFoundException);
    });
    it('should throw an error if save fails', async () => {
      const mockError = new Error('Database error');
      mockRepository.save.mockRejectedValueOnce(mockError);
      await expect(service.createOne(mockData)).rejects.toThrow(
        `Failed to create product: Error => ${mockError}`,
      );
    });
  });
  describe('deleteOne', () => {
    it('should delete a product by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProduct);
      const result = await service.deleteOne(mockId);
      expect(result).toEqual({
        message: 'User deleted successfully',
        data: mockProduct,
      });
    });
    it('should throw a not found exception if product not found', async () => {
      await expect(service.findOne(100)).rejects.toThrow(NotFoundException);
    });
  });
});
