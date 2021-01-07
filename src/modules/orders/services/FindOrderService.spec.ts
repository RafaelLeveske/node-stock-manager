import FakeCustomersRepository from '@modules/customers/repositories/fakes/FakeCustomersRepository';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import FakeProductsRepository from '@modules/products/repositories/fakes/FakeProductsRepository';
import CreateProductService from '@modules/products/services/CreateProductService';
import CreateOrderService from './CreateOrderService';
import FakeOrdersRepository from '../repositories/fakes/FakeOrdersRepository';
import FindOrderService from './FindOrderService';

let fakeOrdersRepository: FakeOrdersRepository;
let fakeProductsRepository: FakeProductsRepository;
let fakeCustomersRepository: FakeCustomersRepository;
let findOrder: FindOrderService;
let createOrder: CreateOrderService;
let createCustomer: CreateCustomerService;
let createProduct: CreateProductService;

describe('FindOrder', () => {
  beforeEach(() => {
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeProductsRepository = new FakeProductsRepository();
    fakeCustomersRepository = new FakeCustomersRepository();
    createCustomer = new CreateCustomerService(fakeCustomersRepository);
    createProduct = new CreateProductService(fakeProductsRepository);
    findOrder = new FindOrderService(
      fakeOrdersRepository,
      fakeProductsRepository,
      fakeCustomersRepository,
    );
    createOrder = new CreateOrderService(
      fakeOrdersRepository,
      fakeProductsRepository,
      fakeCustomersRepository,
    );
  });

  it('should be able to list one specific order', async () => {
    const customer = await createCustomer.execute({
      name: 'Rafael',
      cpf: '12345678910',
      email: 'rafael@gmail.com',
      phone: '99999999999',
    });

    const product = await createProduct.execute({
      name: 'Chave de fenda',
      brand: 'Vonder',
      price: 99,
      quantity: 4,
    });

    const order = await createOrder.execute({
      customer_id: customer.id,
      products: [
        {
          id: product.id,
          quantity: 1,
        },
      ],
    });

    const findOrderId = await findOrder.execute({
      id: order.id,
    });

    expect(findOrderId?.id).toEqual(order.id);
  });
});
