"use server";

import { ShoppingListService } from "~/applications/ShoppingLists/Application/ShoppingList.service";
import type { ShoppingListItem } from "~/applications/ShoppingLists/Domain/Entities/ShoppingListItem";
import { PrismaShoppingListRepository } from "~/applications/ShoppingLists/Infrastructure/Repositories/PrismaShoppingListRepository";

const shoppingListService = new ShoppingListService(new PrismaShoppingListRepository());

export const updateShoppingListItem = async (
  itemId: string,
  data: Partial<ShoppingListItem>
): Promise<any> => {
  try {
    const updatedItem = await shoppingListService.updateShoppingListItem(itemId, data);
    return updatedItem.toObject();
  } catch (error) {
    console.error("Error updating shopping list item:", error);
    throw new Error("Failed to update shopping list item", { cause: "FormError" });
  }
};
