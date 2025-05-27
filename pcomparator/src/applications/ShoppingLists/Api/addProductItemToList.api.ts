"use server";

import { ShoppingListItemApplicationService } from "~/ShoppingLists/Application/Services/ShoppingListItem.service";
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
    const item = await shoppingListItemService.addItemToList(listId, {
      productId: itemData.productId,
      customName: itemData.customName || itemData.productName, // Utilise le nom custom ou le nom du produit
      quantity: itemData.quantity,
      unit: itemData.unit,
      price: itemData.price,
      isCompleted: itemData.isCompleted || false
    });

    return item.toObject();
  } catch (error) {
    console.error("Error adding product item to list", error);
    throw new Error("Failed to add product item to list");
  }
};
