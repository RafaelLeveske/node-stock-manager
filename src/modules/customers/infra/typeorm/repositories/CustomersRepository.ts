import { getRepository, Repository } from 'typeorm';

import ICreateCustomerDTO from '@modules/customers/dtos/ICreateCustomerDTO';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Customer from '../entities/Customer';

class CustomersRepository implements ICustomersRepository {
  private ormRepository: Repository<Customer>;

  constructor() {
    this.ormRepository = getRepository(Customer);
  }

  public async create({
    name,
    email,
    cpf,
    phone,
  }: ICreateCustomerDTO): Promise<Customer> {
    const customer = this.ormRepository.create({
      name,
      email,
      cpf,
      phone,
    });

    await this.ormRepository.save(customer);

    return customer;
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const findCustomer = await this.ormRepository.findOne(id);

    return findCustomer;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const findCustomer = await this.ormRepository.findOne({
      where: {
        email,
      },
    });

    return findCustomer;
  }

  public async findByCPF(cpf: string): Promise<Customer | undefined> {
    const findCustomer = await this.ormRepository.findOne({
      where: {
        cpf,
      },
    });

    return findCustomer;
  }
}

export default CustomersRepository;
