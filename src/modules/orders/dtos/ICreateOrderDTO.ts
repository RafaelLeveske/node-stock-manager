import Customer from '@modules/customers/infra/typeorm/entities/Customer';

interface IProduct {
  product_id: number;
  price: number;
  quantity: number;
}

export default interface ICreateOrderDTO {
  customer: Customer;
  products: IProduct[];
}
