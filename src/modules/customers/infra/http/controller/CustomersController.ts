import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, cpf, phone } = request.body;

    const createCustomer = container.resolve(CreateCustomerService);

    const customer = await createCustomer.execute({
      name,
      email,
      cpf,
      phone,
    });

    return response.json(customer);
  }
}
