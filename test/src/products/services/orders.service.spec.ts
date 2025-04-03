import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { OrdersService } from '../../../../src/users/services/orders.service';
import { Order } from '../../../../src/users/entities/order.entity';
import { Customer } from '../../../../src/users/entities/customer.entity';

describe('OrdersService', () => {
  let service: OrdersService;


  const mockRepository = {

  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockRepository
        },
        {
          provide: getRepositoryToken(Customer),
          useValue: mockRepository
        }
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
