import { Test, TestingModule } from '@nestjs/testing';

import { GroupController } from './group.controller';

const httpMocks = require('node-mocks-http');

describe('GroupController', () => {
  let groupController: GroupController;

  const mockRequest = httpMocks.createRequest();
  mockRequest.user = new User();
  mockRequest.user = 'DUE';

  const mockProduct: Product = {
    body: 'nivea',
    createdAt: new Date(),
    creator: mockRequest.user,
  };

  const mockProductService = {
    createProduct: jest
      .fn()
      .mockImplementation((user: User, product: Product) => {
        return {
          id: 1,
          ...product,
        };
      }),
  };
  const mockUserService = {};

  // create fake module
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        { provide: UserService, useValue: mockUserService },
        {
          provide: JwtGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    })
      .overrideProvider(ProductService)
      .useValue(mockProductService)
      .compile();

    productController = moduleRef.get<ProductController>(ProductController);
  });
});
