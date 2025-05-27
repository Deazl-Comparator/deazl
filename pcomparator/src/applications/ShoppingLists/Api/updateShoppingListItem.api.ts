"use server";

import { ShoppingListItemApplicationService } from "~/ShoppingLists/Application/Services/ShoppingListItem.service";
import type { ShoppingListItemPayload } from "~/ShoppingLists/Domain/Entities/ShoppingListItem.entity";
import { ItemQuantity } from "~/ShoppingLists/Domain/ValueObjects/ItemQuantity.vo";
import { Price } from "~/ShoppingLists/Domain/ValueObjects/Price.vo";
import { Unit } from "~/ShoppingLists/Domain/ValueObjects/Unit.vo";
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
    // Validation et création des Value Objects pour les champs modifiés
    const validatedData: typeof data = { ...data };

    if (data.quantity !== undefined) {
      const quantity = ItemQuantity.create(data.quantity);
      validatedData.quantity = quantity.value;
    }

    if (data.unit !== undefined) {
      const unit = Unit.create(data.unit);
      validatedData.unit = unit.value;
    }

    if (data.price !== undefined) {
      const price = Price.createOptional(data.price);
      validatedData.price = price?.value ?? undefined;
    }

    // Validation du nom personnalisé
    if (data.customName !== undefined && data.customName && data.customName.trim().length < 2) {
      throw new Error("Item name must be at least 2 characters long");
    }

    const updatedItem = await shoppingListItemService.updateShoppingListItem(itemId, validatedData);
    return updatedItem.toObject();
  } catch (error) {
    console.error("Error updating shopping list item:", error);

    // Préserver les erreurs métier des Value Objects
    if (error instanceof Error && error.message.includes("Quantity must be at least")) {
      throw new Error(`Invalid quantity: ${error.message}`, { cause: "FormError" });
    }
    if (error instanceof Error && error.message.includes("Price cannot be negative")) {
      throw new Error(`Invalid price: ${error.message}`, { cause: "FormError" });
    }
    if (error instanceof Error && error.message.includes("Unit")) {
      throw new Error(`Invalid unit: ${error.message}`, { cause: "FormError" });
    }

    if (error instanceof Error) {
      const message = error.message;

      if (message === "Item not found" || message === "You need edit rights to modify this list")
        throw new Error(message, { cause: "FormError" });
    }
    throw new Error("Failed to update shopping list item", { cause: "FormError" });
  }
};
