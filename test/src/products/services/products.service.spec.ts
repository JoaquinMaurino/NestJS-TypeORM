import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProductsService } from '../../../../src/products/services/products.service';
import { Product } from '../../../../src/products/entities/product.entity';
import { CreateProductDto } from '../../../../src/products/dtos/product.dto';
import { Brand } from '../../../../src/products/entities/brand.entity';
import { Category } from '../../../../src/products/entities/category.entity';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockProdId = 1;
  const mockCategory = new Category();
  const mockBrand = new Brand();
  mockCategory.id = 1;
  const mockData: CreateProductDto = {
    name: 'Product',
    description: 'Product',
    price: 1,
    stock: 1,
    image: 'image.com',
    brandId: 1,
    categoriesIds: [1],
  };
  const mockProduct = {
    id: mockProdId,
    ...mockData,
    brand: mockBrand,
    categories: [mockCategory],
    updateAt: expect.any(Date),
    createAt: expect.any(Date),
  };
  const mockProdNoCat = {
    ...mockProduct,
    categories: [],
  };
  const mockProducts = [mockProduct];
  const mockRepository = {
    find: jest.fn().mockResolvedValue(mockProducts),
    findOneBy: jest.fn(),
    findOne: jest.fn().mockResolvedValueOnce(mockProduct),
    create: jest.fn().mockResolvedValueOnce(mockProduct),
    save: jest.fn().mockResolvedValueOnce(mockProduct),
    merge: jest.fn().mockResolvedValue(mockProduct),
    delete: jest.fn().mockResolvedValue(mockProduct),
  };

  const mockCatRepo = {
    findBy: jest.fn().mockResolvedValue([mockCategory]),
    findOneBy: jest.fn().mockResolvedValue(mockCategory),
  };

  const mockBrandRepo = {
    findOneBy: jest.fn().mockResolvedValueOnce(mockBrand),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCatRepo,
        },
        {
          provide: getRepositoryToken(Brand),
          useValue: mockBrandRepo,
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
      const result = await service.findOne(mockProdId);
      expect(result).toEqual(mockProduct);
    });
    it('should throw an exception if product is not found', async () => {
      await expect(service.findOne(100)).rejects.toThrow(NotFoundException);
    });
  });
  describe('createOne', () => {
    it('should create a product', async () => {
      jest.spyOn(mockRepository, 'create').mockReturnValue(mockProduct);
      jest.spyOn(mockRepository, 'save').mockResolvedValue(mockProduct);
      const result = await service.createOne(mockData);
      expect(result).toEqual(mockProduct);
    });
    it('should throw an error if save fails', async () => {
      const mockError = new Error('Database error');
      jest.spyOn(mockRepository, 'create').mockReturnValue(mockProduct);
      jest.spyOn(mockRepository, 'save').mockRejectedValueOnce(mockError);
      await expect(service.createOne(mockData)).rejects.toThrow(
        `Failed to create product: Error => ${mockError}`,
      );
    });
  });
  describe('updateOne', () => {
    it('should update a product by id', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(mockProduct);
      const result = await service.updateOne(mockProdId, mockData);
      expect(result).toEqual({
        message: 'Product updated successfully',
        data: mockProduct,
      });
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
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockProduct);
      const result = await service.deleteOne(mockProdId);
      expect(result).toEqual({
        message: 'User deleted successfully',
        data: mockProduct,
      });
    });
    it('should throw a not found exception if product not found', async () => {
      await expect(service.findOne(100)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category from a product', async () => {
      jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(mockProduct);
      jest.spyOn(mockRepository, 'save').mockResolvedValueOnce(mockProdNoCat);
      const result = await service.deleteCategory(mockProdId, mockCategory.id);
      expect(result).toEqual({
        message: `Category ${mockCategory.id} removed successfully from Product ${mockProdId}`,
        data: mockProdNoCat,
      });
    });
    it('should throw an exception if product is not fund', async()=>{
      await expect(service.deleteCategory(999,999)).rejects.toThrow(NotFoundException)
    })
  });

  describe('addCategory', () => {
    it('should add a category to a product', async () => {
      jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(mockProduct);
      jest.spyOn(mockCatRepo, 'findOneBy').mockResolvedValueOnce(mockCategory);
      jest.spyOn(mockRepository, 'save').mockResolvedValueOnce(mockProduct);

      const result = await service.addCategory(mockProdId, mockCategory.id);
      expect(result).toEqual({
        message: `Category ${mockCategory.id} added successfully to Product ${mockProdId}`,
        data: mockProduct,
      });
    });
    it('should throw an exception if product or category are not fund', async()=>{
      await expect(service.addCategory(999,999)).rejects.toThrow(NotFoundException)
    })
  });
});
