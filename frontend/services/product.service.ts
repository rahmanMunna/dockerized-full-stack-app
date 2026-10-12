import { apiClient } from "@/lib/api-client";
import type {
  CreateProductInput,
  CreateProductResponse,
  Product,
} from "@/types/product";

export const productService = {
  async getAll(signal?: AbortSignal): Promise<Product[]> {
    const { data } = await apiClient.get<Product[]>("/product", { signal });
    return data;
  },

  async create(input: CreateProductInput): Promise<CreateProductResponse> {
    const { data } = await apiClient.post<CreateProductResponse>(
      "/product",
      input,
    );
    return data;
  },
};
