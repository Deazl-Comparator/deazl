import { z } from "zod";
import { ShoppingListItemSchema } from "./ShoppingListItem";

export const ShoppingListSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  userId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  items: z.array(ShoppingListItemSchema).optional()
});

export const CreateShoppingListSchema = ShoppingListSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  items: true
}).extend({
  items: z.array(ShoppingListItemSchema.omit({ id: true, shoppingListId: true })).optional()
});

export type ShoppingList = z.infer<typeof ShoppingListSchema>;
export type CreateShoppingList = z.infer<typeof CreateShoppingListSchema>;
