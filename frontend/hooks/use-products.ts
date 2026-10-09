"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { getErrorMessage } from "@/lib/api-client";
import { productService } from "@/services/product.service";
import type { Product } from "@/types/product";

type ProductsState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; products: Product[] };

export function useProducts() {
  const [state, setState] = useState<ProductsState>({ status: "loading" });
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    productService
      .getAll(controller.signal)
      .then((products) => setState({ status: "success", products }))
      .catch((error: unknown) => {
        if (axios.isCancel(error)) return;
        setState({ status: "error", error: getErrorMessage(error) });
      });

    return () => controller.abort();
  }, [requestId]);

  const refetch = useCallback(() => {
    setState({ status: "loading" });
    setRequestId((id) => id + 1);
  }, []);

  return { ...state, refetch };
}
