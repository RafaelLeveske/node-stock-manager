import { getRepository, Repository } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import AppError from '@shared/errors/AppError';
import Product from '../entities/Product';

interface IFindProducts {
  id: number;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    brand,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      brand,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async save(product: Product): Promise<Product> {
    return this.ormRepository.save(product);
  }

  public async findProductsByNameAndBrand(
    name: string,
    brand: string,
  ): Promise<Product | undefined> {
    const productsToFind = this.ormRepository.findOne({
      where: { name, brand },
    });

    return productsToFind;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    return this.ormRepository.findByIds(products);
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productsList = await this.ormRepository.findByIds(products);

    const updatedProductsList = productsList.map(productFromList => {
      const productToSubtract = products.find(
        product => product.id === productFromList.id,
      );

      if (!productToSubtract) {
        throw new AppError(
          'Error when updating product quantity, product id not found',
        );
      }

      Object.assign(productFromList, {
        quantity: productFromList.quantity - productToSubtract.quantity,
      });

      return productFromList;
    });

    await this.ormRepository.save(updatedProductsList);

    return updatedProductsList;
  }
}

export default ProductsRepository;
