import { z } from "zod";

export const UnitSchema = z.enum(["unit", "kg", "g", "l", "ml", "piece"]);

export type Unit = z.infer<typeof UnitSchema>;

export const ShoppingListItemSchema = z.object({
  id: z.string().uuid(),
  shoppingListId: z.string().uuid(),
  productId: z.string().uuid().nullable().optional(),
  quantity: z.number().positive().default(1),
  unit: UnitSchema.default("unit"),
  isCompleted: z.boolean().default(false),
  customName: z.string().nullable().optional(),
  price: z.number().positive().optional(), // Ajout du champ prix
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const CreateShoppingListItemSchema = ShoppingListItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type ShoppingListItem = z.infer<typeof ShoppingListItemSchema>;
export type CreateShoppingListItem = z.infer<typeof CreateShoppingListItemSchema>;
