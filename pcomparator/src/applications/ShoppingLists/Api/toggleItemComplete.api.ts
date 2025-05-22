"use server";

import { ShoppingListService } from "~/applications/ShoppingLists/Application/ShoppingList.service";
import { PrismaShoppingListRepository } from "~/applications/ShoppingLists/Infrastructure/Repositories/PrismaShoppingListRepository";

const shoppingListService = new ShoppingListService(new PrismaShoppingListRepository());

export const toggleItemComplete = async (itemId: string, isCompleted: boolean): Promise<void> => {
  try {
    await shoppingListService.updateShoppingListItem(itemId, { isCompleted });
  } catch (error) {
    console.error("Server error toggling item completion:", error);
    throw new Error("Failed to update item status");
  }
};
