import { z } from "zod";

// Form inputs arrive as strings; each number field is checked for presence,
// then converted and validated as a number.
export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  price: z
    .string()
    .trim()
    .min(1, "Price is required")
    .transform(Number)
    .pipe(
      z
        .number({ error: "Price must be a number" })
        .positive("Price must be greater than 0"),
    ),
  qty: z
    .string()
    .trim()
    .min(1, "Quantity is required")
    .transform(Number)
    .pipe(
      z
        .number({ error: "Quantity must be a number" })
        .int("Quantity must be a whole number")
        .min(0, "Quantity cannot be negative"),
    ),
});

export type ProductFormValues = z.input<typeof createProductSchema>;
