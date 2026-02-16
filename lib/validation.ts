import { z } from "zod";

// Schema for creating a new booking
export const createBookingSchema = z.object({
  customerName: z
    .string()
    .min(2, "Customer name must be at least 2 characters")
    .max(100, "Customer name must be less than 100 characters"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
});

// Schema for updating an existing booking
export const updateBookingSchema = z.object({
  customerName: z
    .string()
    .min(2, "Customer name must be at least 2 characters")
    .max(100, "Customer name must be less than 100 characters")
    .optional(),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date",
    })
    .optional(),
});

// Schema for month query parameter
export const monthQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format")
    .refine(
      (val) => {
        const [year, month] = val.split("-").map(Number);
        return year >= 2020 && year <= 2100 && month >= 1 && month <= 12;
      },
      {
        message: "Invalid month value",
      },
    ),
});

// Type exports
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type MonthQueryInput = z.infer<typeof monthQuerySchema>;
