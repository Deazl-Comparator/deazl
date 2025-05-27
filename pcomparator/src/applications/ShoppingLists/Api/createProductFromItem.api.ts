"use server";

import { ShoppingListItemApplicationService } from "~/ShoppingLists/Application/Services/ShoppingListItem.service";
import { PrismaShoppingListRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingList.infrastructure";
import { PrismaShoppingListItemRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingListItem.infrastructure";

const shoppingListItemService = new ShoppingListItemApplicationService(
  new PrismaShoppingListRepository(),
  new PrismaShoppingListItemRepository()
);

export async function createProductFromItem(data: {
  name: string;
  price: number;
  unit: string;
  quantity: number;
  brandName: string;
  storeName: string;
  storeLocation: string;
  referencePrice: number;
  referenceUnit: string;
}): Promise<any> {
  try {
    const result = await shoppingListItemService.createProductFromItem(data);
    return result;
  } catch (error) {
    console.error("Error creating product from item:", error);
    throw new Error("Failed to create product");
  }
}
