import AppError from '@shared/errors/AppError';
import FakeCustomersRepository from '../repositories/fakes/FakeCustomersRepository';
import CreateCustomerService from './CreateCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let createCustomer: CreateCustomerService;

describe('CreateCustomer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    createCustomer = new CreateCustomerService(fakeCustomersRepository);
  });

  it('should be able to create a new customer', async () => {
    const user = await createCustomer.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      cpf: '12345678910',
      phone: '61999999999',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new customer with same email from another', async () => {
    await createCustomer.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      cpf: '12345678910',
      phone: '61999999999',
    });

    await expect(
      createCustomer.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        cpf: '12345678911',
        phone: '61999999999',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new customer with same cpf from another', async () => {
    await createCustomer.execute({
      name: 'John Doe',
      email: 'johndoe1@example.com',
      cpf: '12345678910',
      phone: '61999999999',
    });

    await expect(
      createCustomer.execute({
        name: 'John Doe',
        email: 'johndoe2@example.com',
        cpf: '12345678910',
        phone: '61999999999',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
