import { apiClient } from "@/lib/api-client";
import type { Product } from "@/types/product";

export const productService = {
  async getAll(signal?: AbortSignal): Promise<Product[]> {
    const { data } = await apiClient.get<Product[]>("/product", { signal });
    return data;
  },
};
