"use server";

import { ShoppingListApplicationService } from "../Application/Services/ShoppingList.service";
import { PrismaShoppingListRepository } from "../Infrastructure/Repositories/PrismaShoppingList.infrastructure";

const shoppingListApplicationService = new ShoppingListApplicationService(new PrismaShoppingListRepository());

export const updateShoppingList = async (
  id: string,
  data: Partial<{ name: string; description: string }>
) => {
  try {
    const list = await shoppingListApplicationService.updateShoppingList(id, data);
    return list.toObject();
  } catch (error) {
    console.error("Error updating shopping list", error);
    if (error instanceof Error) {
      if (
        error.message === "Shopping list not found" ||
        error.message === "Unauthorized - insufficient permissions to modify list"
      ) {
        throw new Error(error.message, { cause: "FormError" });
      }
    }
    throw new Error("Failed to update shopping list", { cause: "FormError" });
  }
};
