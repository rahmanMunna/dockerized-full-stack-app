"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
} from "react";
import { z } from "zod";
import { getErrorMessage } from "@/lib/api-client";
import {
  createProductSchema,
  type ProductFormValues,
} from "@/schemas/product.schema";
import { productService } from "@/services/product.service";
import type { Product } from "@/types/product";

const EMPTY_VALUES: ProductFormValues = { name: "", price: "", qty: "" };

type FieldErrors = Partial<Record<keyof ProductFormValues, string[]>>;
type Feedback = { kind: "success" | "error"; message: string };

export function ProductForm({
  onCreated,
}: {
  onCreated: (product: Product) => void;
}) {
  const [values, setValues] = useState<ProductFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const result = createProductSchema.safeParse(values);
    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const { message, product } = await productService.create(result.data);
      onCreated(product);
      setValues(EMPTY_VALUES);
      setFeedback({ kind: "success", message });
    } catch (error) {
      setFeedback({ kind: "error", message: getErrorMessage(error) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mb-8 rounded-lg border border-black/10 p-4 shadow-sm dark:border-white/15"
    >
      <h2 className="mb-4 text-lg font-semibold">Add product</h2>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label="Name"
          name="name"
          value={values.name}
          error={errors.name?.[0]}
          onChange={handleChange}
        />
        <Field
          label="Price"
          name="price"
          type="number"
          step="0.01"
          value={values.price}
          error={errors.price?.[0]}
          onChange={handleChange}
        />
        <Field
          label="Quantity"
          name="qty"
          type="number"
          step="1"
          value={values.qty}
          error={errors.qty?.[0]}
          onChange={handleChange}
        />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add product"}
        </button>
        {feedback && (
          <p
            role={feedback.kind === "error" ? "alert" : "status"}
            className={
              feedback.kind === "error"
                ? "text-sm text-red-600"
                : "text-sm text-green-600"
            }
          >
            {feedback.message}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  ...inputProps
}: {
  label: string;
  name: keyof ProductFormValues;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  const errorId = `${name}-error`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="rounded-md border border-black/20 bg-transparent px-3 py-2 text-sm aria-invalid:border-red-600 dark:border-white/25"
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
