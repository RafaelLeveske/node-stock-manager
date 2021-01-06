import AppError from '@shared/errors/AppError';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import CreateProductService from './CreateProductService';

let fakeProductsRepository: FakeProductsRepository;
let createProduct: CreateProductService;

describe('CreateProduct', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    createProduct = new CreateProductService(fakeProductsRepository);
  });

  it('should be able to create a new product', async () => {
    const product = await createProduct.execute({
      name: 'Chave de boca',
      brand: 'Vonder',
      price: 10.5,
      quantity: 1,
    });

    expect(product).toHaveProperty('id');
  });

  it('should not be able to create a new product with same name and brand from another', async () => {
    await createProduct.execute({
      name: 'Chave de fenda',
      brand: 'Tramontina',
      price: 10.5,
      quantity: 1,
    });

    await expect(
      createProduct.execute({
        name: 'Chave de fenda',
        brand: 'Tramontina',
        price: 10.5,
        quantity: 1,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
