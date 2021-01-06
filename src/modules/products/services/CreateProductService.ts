import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  brand: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    name,
    brand,
    price,
    quantity,
  }: IRequest): Promise<Product> {
    const checkProductExists = await this.productsRepository.findProductsByNameAndBrand(
      name,
      brand,
    );

    if (checkProductExists) {
      throw new AppError('Product already exists');
    }

    const product = await this.productsRepository.create({
      name,
      brand,
      price,
      quantity,
    });

    return product;
  }
}

export default CreateProductService;
