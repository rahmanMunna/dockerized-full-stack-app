import type { Product } from "@/types/product";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-lg border border-black/10 p-4 shadow-sm dark:border-white/15">
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="mt-2 text-sm">Price: {currency.format(product.price)}</p>
      <p className="text-sm">Quantity: {product.qty}</p>
    </article>
  );
}
