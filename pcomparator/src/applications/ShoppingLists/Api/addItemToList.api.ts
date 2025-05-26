"use server";

import { ShoppingListItemApplicationService } from "../Application/Services/ShoppingListItem.service";
import { PrismaShoppingListRepository } from "../Infrastructure/Repositories/PrismaShoppingList.infrastructure";
import { PrismaShoppingListItemRepository } from "../Infrastructure/Repositories/PrismaShoppingListItem.infrastructure";

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
  }
) => {
  try {
    const item = await shoppingListItemService.addItemToList(listId, itemData);
    return item.toObject();
  } catch (error) {
    console.error("Error adding item to list", error);
    throw new Error("Failed to add item to list");
  }
};
