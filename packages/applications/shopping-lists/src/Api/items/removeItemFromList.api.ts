"use server";

import { z } from "zod";
import { ShoppingListItemApplicationService } from "~/Application/Services/ShoppingListItem.service";
import { PrismaShoppingListRepository } from "~/Infrastructure/Repositories/PrismaShoppingList.infrastructure";
import { PrismaShoppingListItemRepository } from "~/Infrastructure/Repositories/PrismaShoppingListItem.infrastructure";

const shoppingListItemService = new ShoppingListItemApplicationService(
  new PrismaShoppingListRepository(),
  new PrismaShoppingListItemRepository()
);

export const RemoveItemFromListSchema = z.string().uuid();

export type RemoveItemFromListPayload = z.infer<typeof RemoveItemFromListSchema>;

export const removeItemFromList = async (itemId: RemoveItemFromListPayload): Promise<void> => {
  try {
    const payload = RemoveItemFromListSchema.parse(itemId);

    await shoppingListItemService.removeShoppingListItem(payload);
  } catch (error) {
    throw new Error("Failed to remove item from list", { cause: error });
  }
};
