import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
  cpf: string;
  phone: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    name,
    email,
    cpf,
    phone,
  }: IRequest): Promise<Customer> {
    const checkCustomerExists = await this.customersRepository.findByEmail(
      email,
    );
    if (checkCustomerExists) {
      throw new AppError('Email address already used');
    }

    const checkCPFExists = await this.customersRepository.findByCPF(cpf);

    if (checkCPFExists) {
      throw new AppError('CPF already exists');
    }

    const customer = await this.customersRepository.create({
      name,
      email,
      cpf,
      phone,
    });

    return customer;
  }
}

export default CreateCustomerService;
