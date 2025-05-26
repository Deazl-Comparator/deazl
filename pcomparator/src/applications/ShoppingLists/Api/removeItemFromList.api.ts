"use server";

import { ShoppingListItemApplicationService } from "../Application/Services/ShoppingListItem.service";
import { PrismaShoppingListRepository } from "../Infrastructure/Repositories/PrismaShoppingList.infrastructure";
import { PrismaShoppingListItemRepository } from "../Infrastructure/Repositories/PrismaShoppingListItem.infrastructure";

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
