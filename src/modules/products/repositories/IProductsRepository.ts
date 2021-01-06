import ICreateProductDTO from '../dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '../dtos/IUpdateProductsQuantityDTO';
// import IFindProductsByNameAndBrandDTO from '../dtos/IFindProductsByNameAndBrandDTO';
import Product from '../infra/typeorm/entities/Product';

interface IFindProducts {
  id: number;
}

export default interface IProductsRepository {
  create(data: ICreateProductDTO): Promise<Product>;
  save(product: Product): Promise<Product>;
  findProductsByNameAndBrand(
    name: string,
    brand: string,
  ): Promise<Product | undefined>;
  findAllById(products: IFindProducts[]): Promise<Product[]>;
  updateQuantity(products: IUpdateProductsQuantityDTO[]): Promise<Product[]>;
}
