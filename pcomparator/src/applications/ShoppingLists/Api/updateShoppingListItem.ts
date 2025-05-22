"use server";

import { ShoppingListService } from "~/applications/ShoppingLists/Application/ShoppingList.service";
import type { ShoppingListItemPayload } from "~/applications/ShoppingLists/Domain/Entities/ShoppingListItem.entity";
import { PrismaShoppingListRepository } from "~/applications/ShoppingLists/Infrastructure/Repositories/PrismaShoppingListRepository";

const shoppingListService = new ShoppingListService(new PrismaShoppingListRepository());

export const updateShoppingListItem = async (
  itemId: string,
  data: Partial<Pick<ShoppingListItemPayload, "customName" | "quantity" | "unit" | "price" | "isCompleted">>
): Promise<any> => {
  try {
    const updatedItem = await shoppingListService.updateShoppingListItem(itemId, data);
    return updatedItem.toObject();
  } catch (error) {
    console.error("Error updating shopping list item:", error);
    if (error instanceof Error) {
      const message = error.message;

      if (message === "Item not found" || message === "You need edit rights to modify this list")
        throw new Error(message, { cause: "FormError" });
    }
    throw new Error("Failed to update shopping list item", { cause: "FormError" });
  }
};
