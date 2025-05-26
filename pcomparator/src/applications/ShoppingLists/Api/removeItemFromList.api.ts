"use server";

import { ShoppingListItemApplicationService } from "~/ShoppingLists/Application/Services/ShoppingListItem.service";
import { PrismaShoppingListRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingList.infrastructure";
import { PrismaShoppingListItemRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingListItem.infrastructure";

const shoppingListItemService = new ShoppingListItemApplicationService(
  new PrismaShoppingListRepository(),
  new PrismaShoppingListItemRepository()
);

export const removeItemFromList = async (itemId: string) => {
  try {
    await shoppingListItemService.removeShoppingListItem(itemId);
    return { success: true };
  } catch (error) {
    console.error("Error removing item from list", error);
    throw new Error("Failed to remove item from list");
  }
};
