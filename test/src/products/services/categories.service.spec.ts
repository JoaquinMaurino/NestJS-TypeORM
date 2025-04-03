import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { CategoriesService } from '../../../../src/products/services/categories.service';
import { Category } from '../../../../src/products/entities/category.entity';
import { FilterOptionsDto } from '../../../../src/common/filter-options.dto';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../../../../src/products/dtos/category.dto';

describe('Categories Service', () => {
  let service: CategoriesService;

  const mockCatId = 1;
  const mockCreateCatData: CreateCategoryDto = {
    name: 'Category',
  };
  const mockCategory: Category = {
    ...mockCreateCatData,
    id: mockCatId,
    products: [],
    createAt: expect.any(Date),
    updateAt: expect.any(Date),
  };
  const mockCategories = [mockCategory];

  const mockRepository = {
    find: jest.fn().mockResolvedValue(mockCategories),
    findOne: jest.fn().mockResolvedValueOnce(mockCategory),
    findOneBy: jest.fn().mockResolvedValueOnce(mockCategory),
    create: jest.fn().mockResolvedValue(mockCategory),
    save: jest.fn().mockResolvedValueOnce(mockCategory),
    delete: jest.fn(),
    merge: jest.fn().mockResolvedValue(mockCategory),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('shuld return an array of categories', async () => {
      const params: FilterOptionsDto = {};
      const result = await service.findAll(params);
      expect(result).toEqual(mockCategories);
    });
  });

  describe('findOne', () => {
    it('should return a category if id matches', async () => {
      const result = await service.findOne(mockCatId);
      expect(result).toEqual(mockCategory);
    });
    it('should throw an exception if category is not found', async () => {
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createOne', () => {
    it('should create a category and save it in the DB', async () => {
      const result = await service.createOne(mockCreateCatData);
      expect(result).toEqual(mockCategory);
    });
  });

  describe('deleteOne', () => {
    it('should delete a category by id', async () => {
      const result = await service.deleteOne(mockCatId);
      expect(result).toEqual({
        message: 'Category deleted successfully',
        data: mockCategory,
      });
    });
    it('should throw an exception if category is not found', async () => {
      await expect(service.deleteOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateOne', () => {
    it('should update a cateory by id with new data', async () => {
      const data: UpdateCategoryDto = {
        name: 'Updated categoory',
      };
      jest.spyOn(mockRepository, 'findOne').mockResolvedValue(mockCategory);
      const result = await service.updateOne(mockCatId, data);
      expect(result).toEqual(mockCategory);
    });
  });
});
