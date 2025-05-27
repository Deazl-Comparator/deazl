"use server";

import { ShoppingListItemApplicationService } from "~/ShoppingLists/Application/Services/ShoppingListItem.service";
import { ItemQuantity } from "~/ShoppingLists/Domain/ValueObjects/ItemQuantity.vo";
import { Price } from "~/ShoppingLists/Domain/ValueObjects/Price.vo";
import { Unit } from "~/ShoppingLists/Domain/ValueObjects/Unit.vo";
import { PrismaShoppingListRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingList.infrastructure";
import { PrismaShoppingListItemRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingListItem.infrastructure";

// L'API orchestre en instanciant les dépendances nécessaires
const shoppingListItemService = new ShoppingListItemApplicationService(
  new PrismaShoppingListRepository(),
  new PrismaShoppingListItemRepository()
);

export interface AddProductItemData {
  productId: string;
  productName: string; // Nom du produit depuis la recherche
  quantity: number;
  unit: string;
  price?: number | null;
  customName?: string | null; // Nom personnalisé optionnel (override du nom du produit)
  isCompleted?: boolean;
}

/**
 * Ajoute un item lié à un produit existant à une liste de courses
 */
export const addProductItemToList = async (listId: string, itemData: AddProductItemData) => {
  try {
    // Validation et création des Value Objects dans la couche API
    const quantity = ItemQuantity.create(itemData.quantity);
    const unit = Unit.create(itemData.unit);
    const price = Price.createOptional(itemData.price);

    // Validation du nom (custom ou nom du produit)
    const itemName = itemData.customName || itemData.productName;
    if (itemName && itemName.trim().length < 2) {
      throw new Error("Item name must be at least 2 characters long");
    }

    const item = await shoppingListItemService.addItemToList(listId, {
      productId: itemData.productId,
      customName: itemName,
      quantity: quantity.value,
      unit: unit.value,
      price: price?.value ?? undefined,
      isCompleted: itemData.isCompleted || false
    });

    return item.toObject();
  } catch (error) {
    console.error("Error adding product item to list", error);

    if (error instanceof Error && error.message.includes("Quantity must be at least")) {
      throw new Error(`Invalid quantity: ${error.message}`);
    }
    if (error instanceof Error && error.message.includes("Price cannot be negative")) {
      throw new Error(`Invalid price: ${error.message}`);
    }
    if (error instanceof Error && error.message.includes("Unit")) {
      throw new Error(`Invalid unit: ${error.message}`);
    }

    throw new Error("Failed to add product item to list");
  }
};
