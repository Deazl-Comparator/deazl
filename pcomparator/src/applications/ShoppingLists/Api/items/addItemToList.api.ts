"use server";

import { ShoppingListItemApplicationService } from "~/ShoppingLists/Application/Services/ShoppingListItem.service";
import { ItemQuantity } from "~/ShoppingLists/Domain/ValueObjects/ItemQuantity.vo";
import { Price } from "~/ShoppingLists/Domain/ValueObjects/Price.vo";
import { Unit } from "~/ShoppingLists/Domain/ValueObjects/Unit.vo";
import { PrismaShoppingListRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingList.infrastructure";
import { PrismaShoppingListItemRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingListItem.infrastructure";

const shoppingListItemService = new ShoppingListItemApplicationService(
  new PrismaShoppingListRepository(),
  new PrismaShoppingListItemRepository()
);

export const addItemToList = async (
  listId: string,
  itemData: {
    customName?: string | null;
    quantity: number;
    unit: string;
    isCompleted?: boolean;
    price?: number | null;
    barcode?: string | null;
  }
) => {
  try {
    // Validation et création des Value Objects dans la couche API
    const quantity = ItemQuantity.create(itemData.quantity);
    const unit = Unit.create(itemData.unit);
    const price = Price.createOptional(itemData.price);

    // Validation du nom personnalisé
    if (itemData.customName && itemData.customName.trim().length < 2) {
      throw new Error("Item name must be at least 2 characters long");
    }

    const item = await shoppingListItemService.addItemToList(listId, {
      ...itemData,
      quantity: quantity.value,
      unit: unit.value,
      price: price?.value ?? undefined,
      barcode: itemData.barcode
    });

    return item.toObject();
  } catch (error) {
    console.error("Error adding item to list", error);

    if (error instanceof Error && error.message.includes("Quantity must be at least")) {
      throw new Error(`Invalid quantity: ${error.message}`);
    }
    if (error instanceof Error && error.message.includes("Price cannot be negative")) {
      throw new Error(`Invalid price: ${error.message}`);
    }
    if (error instanceof Error && error.message.includes("Unit")) {
      throw new Error(`Invalid unit: ${error.message}`);
    }

    throw new Error("Failed to add item to list");
  }
};
