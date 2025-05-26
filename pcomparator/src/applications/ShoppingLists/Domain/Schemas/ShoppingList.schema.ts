import { z } from "zod";
import { ShoppingListItemSchema } from "~/applications/ShoppingLists/Domain/Schemas/ShoppingListItem.schema";
import { UserRoleEnum } from "~/applications/ShoppingLists/Domain/Schemas/UserRole.schema";

export const ShoppingListCollaboratorSchema = z.object({
  id: z.string(),
  listId: z.string(),
  userId: z.string(),
  role: UserRoleEnum,
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    image: z.string().nullable()
  })
});

export const ShoppingListSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  userId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  isPublic: z.boolean().default(false),
  items: z.array(ShoppingListItemSchema).optional(),
  collaborators: z.array(ShoppingListCollaboratorSchema).optional()
});

export const CreateShoppingListSchema = ShoppingListSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  items: true
}).extend({
  items: z.array(ShoppingListItemSchema.omit({ id: true, shoppingListId: true })).optional()
});
