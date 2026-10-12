export interface Product {
  id: number;
  name: string;
  price: number;
  qty: number;
}

export type CreateProductInput = Omit<Product, "id">;

export interface CreateProductResponse {
  message: string;
  product: Product;
}
