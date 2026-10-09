import { ProductList } from "@/components/products/product-list";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">Products</h1>
      <ProductList />
    </main>
  );
}
