"use server";

import { ShoppingListApplicationService } from "../Application/Services/ShoppingList.service";
import { PrismaShoppingListRepository } from "../Infrastructure/Repositories/PrismaShoppingList.infrastructure";

const shoppingListApplicationService = new ShoppingListApplicationService(new PrismaShoppingListRepository());

export const deleteShoppingList = async (id: string) => {
  try {
    await shoppingListApplicationService.deleteShoppingList(id);
    return { success: true };
  } catch (error) {
    console.error("Error deleting shopping list", error);
    throw new Error("Failed to delete shopping list");
  }
};
