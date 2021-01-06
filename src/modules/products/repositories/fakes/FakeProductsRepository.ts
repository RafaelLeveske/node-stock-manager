import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '@modules/products/infra/typeorm/entities/Product';
import AppError from '@shared/errors/AppError';
import IProductsRepository from '../IProductsRepository';

interface IFindProducts {
  id: number;
}

export default class FakeProductsRepository implements IProductsRepository {
  private products: Product[] = [];

  public async create(productData: ICreateProductDTO): Promise<Product> {
    const product = new Product();

    Object.assign(product, { id: Number }, productData);

    this.products.push(product);

    return product;
  }

  public async save(product: Product): Promise<Product> {
    const findIndex = this.products.findIndex(
      findProduct => findProduct.id === product.id,
    );

    this.products[findIndex] = product;

    return product;
  }

  public async findProductsByNameAndBrand(
    name: string,
    brand: string,
  ): Promise<Product | undefined> {
    const productList = this.products.find(
      product => product.name === name && product.brand === brand,
    );

    return productList;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const AllIdsFromProductsList = this.products.map(productIdFromList => {
      const productIds = products.find(
        productId => productId.id === productIdFromList.id,
      );

      if (!productIds) {
        throw new AppError('Product id not found');
      }

      return productIdFromList;
    });

    return AllIdsFromProductsList;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productList = this.products;
    const updatedProductsList = productList.map(productFromList => {
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

      this.products.push(productFromList);

      return productFromList;
    });

    return updatedProductsList;
  }
}
