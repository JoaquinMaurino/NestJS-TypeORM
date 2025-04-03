import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../../../../src/users/controllers/orders.controller';
import { OrdersService } from '../../../../src/users/services/orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService

  const mockService = {

  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {provide: OrdersService,
        useValue: mockService}
      ]
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
