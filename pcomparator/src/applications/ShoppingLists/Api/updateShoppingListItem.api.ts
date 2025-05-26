"use server";

import { ShoppingListItemApplicationService } from "~/ShoppingLists/Application/Services/ShoppingListItem.service";
import type { ShoppingListItemPayload } from "~/ShoppingLists/Domain/Entities/ShoppingListItem.entity";
import { PrismaShoppingListRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingList.infrastructure";
import { PrismaShoppingListItemRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingListItem.infrastructure";

const shoppingListItemService = new ShoppingListItemApplicationService(
  new PrismaShoppingListRepository(),
  new PrismaShoppingListItemRepository()
);

export const updateShoppingListItem = async (
  itemId: string,
  data: Partial<Pick<ShoppingListItemPayload, "customName" | "quantity" | "unit" | "price" | "isCompleted">>
): Promise<any> => {
  try {
    const updatedItem = await shoppingListItemService.updateShoppingListItem(itemId, data);
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
