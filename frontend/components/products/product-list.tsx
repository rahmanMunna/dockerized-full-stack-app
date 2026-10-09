"use client";

import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "./product-card";

export function ProductList() {
  const result = useProducts();

  if (result.status === "loading") {
    return <p className="text-center">Loading products...</p>;
  }

  if (result.status === "error") {
    return (
      <div role="alert" className="text-center">
        <p className="text-red-600">{result.error}</p>
        <button
          type="button"
          onClick={result.refetch}
          className="mt-3 rounded-md border px-4 py-2 text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  if (result.products.length === 0) {
    return <p className="text-center">No products found.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {result.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
