import { uuid } from 'uuidv4';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';

import ICreateCustomerDTO from '@modules/customers/dtos/ICreateCustomerDTO';
import Customer from '../../infra/typeorm/entities/Customer';

export default class FakeCustomersRepository implements ICustomersRepository {
  private customers: Customer[] = [];

  public async findById(id: string): Promise<Customer | undefined> {
    const findCustomer = this.customers.find(customer => customer.id === id);

    return findCustomer;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const findCustomer = this.customers.find(
      customer => customer.email === email,
    );

    return findCustomer;
  }

  public async findByCPF(cpf: string): Promise<Customer | undefined> {
    const findCustomer = this.customers.find(customer => customer.cpf === cpf);

    return findCustomer;
  }

  public async create(customerData: ICreateCustomerDTO): Promise<Customer> {
    const customer = new Customer();

    Object.assign(customer, { id: uuid() }, customerData);

    this.customers.push(customer);

    return customer;
  }

  public async save(customer: Customer): Promise<Customer> {
    const findIndex = this.customers.findIndex(
      findCustomer => findCustomer.id === customer.id,
    );

    this.customers[findIndex] = customer;

    return customer;
  }
}
