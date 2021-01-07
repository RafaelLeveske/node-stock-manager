import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: number;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer does not exists');
    }

    const productList = await this.productsRepository.findAllById(products);

    const formattedProductList = products.map(product => {
      const productEntity = productList.find(
        productFromList => productFromList.id === product.id,
      );

      if (!productEntity) {
        throw new AppError('Invalid product');
      }

      if (product.quantity > productEntity.quantity) {
        throw new AppError(
          `The quantity of ${productEntity.name} in stock is insufficient`,
        );
      }

      return {
        product_id: product.id,
        price: productEntity.price,
        quantity: product.quantity,
      };
    });

    await this.productsRepository.updateQuantity(products);

    const order = await this.ordersRepository.create({
      customer,
      products: formattedProductList,
    });

    return order;
  }
}

export default CreateOrderService;
