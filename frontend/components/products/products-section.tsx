"use client";

import { useProducts } from "@/hooks/use-products";
import { ProductForm } from "./product-form";
import { ProductList } from "./product-list";

// Owns the product state so the form and the list stay in sync.
export function ProductsSection() {
  const result = useProducts();

  return (
    <>
      <ProductForm onCreated={result.addProduct} />
      <ProductList result={result} />
    </>
  );
}
