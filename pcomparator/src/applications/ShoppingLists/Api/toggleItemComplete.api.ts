"use server";

import { ShoppingListItemApplicationService } from "~/ShoppingLists/Application/Services/ShoppingListItem.service";
import { PrismaShoppingListRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingList.infrastructure";
import { PrismaShoppingListItemRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingListItem.infrastructure";

const shoppingListItemService = new ShoppingListItemApplicationService(
  new PrismaShoppingListRepository(),
  new PrismaShoppingListItemRepository()
);

export const toggleItemComplete = async (itemId: string, isCompleted: boolean): Promise<void> => {
  try {
    await shoppingListItemService.updateShoppingListItem(itemId, { isCompleted });
  } catch (error) {
    console.error("Server error toggling item completion:", error);
    throw new Error("Failed to update item status");
  }
};
