import FakeCustomersRepository from '@modules/customers/repositories/fakes/FakeCustomersRepository';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import FakeProductsRepository from '@modules/products/repositories/fakes/FakeProductsRepository';
import CreateProductService from '@modules/products/services/CreateProductService';
import AppError from '@shared/errors/AppError';
import FakeOrdersRepository from '../repositories/fakes/FakeOrdersRepository';
import CreateOrderService from './CreateOrderService';

let fakeOrdersRepository: FakeOrdersRepository;
let fakeProductsRepository: FakeProductsRepository;
let fakeCustomersRepository: FakeCustomersRepository;
let createOrder: CreateOrderService;
let createCustomer: CreateCustomerService;
let createProduct: CreateProductService;

describe('CreateOrder', () => {
  beforeEach(() => {
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeProductsRepository = new FakeProductsRepository();
    fakeCustomersRepository = new FakeCustomersRepository();
    createCustomer = new CreateCustomerService(fakeCustomersRepository);
    createProduct = new CreateProductService(fakeProductsRepository);
    createOrder = new CreateOrderService(
      fakeOrdersRepository,
      fakeProductsRepository,
      fakeCustomersRepository,
    );
  });

  it('should be able to create a new order', async () => {
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

    expect(order).toHaveProperty('id');
  });

  it('should not be able to create an order with a invalid customer', async () => {
    const product = await createProduct.execute({
      name: 'Chave de torque',
      brand: 'Vonder',
      price: 99,
      quantity: 4,
    });

    await expect(
      createOrder.execute({
        customer_id: 'invalid_customer_id',
        products: [
          {
            id: product.id,
            quantity: 1,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an order with invalid products', async () => {
    const customer = await createCustomer.execute({
      name: 'Rafael',
      cpf: '12345678910',
      email: 'rafael@gmail.com',
      phone: '99999999999',
    });

    await expect(
      createOrder.execute({
        customer_id: customer.id,
        products: [
          {
            id: 558,
            quantity: 1,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an order with products with insufficient quantities', async () => {
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

    await expect(
      createOrder.execute({
        customer_id: customer.id,
        products: [
          {
            id: product.id,
            quantity: 5,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to subtract an product total quantity when it is ordered', async () => {
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

    await createOrder.execute({
      customer_id: customer.id,
      products: [
        {
          id: product.id,
          quantity: 1,
        },
      ],
    });

    expect(product.quantity).toBeLessThan(4);
  });
});
