"use server";

import type { ShoppingList } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList.entity";
import { ShoppingListService } from "../Application/ShoppingList.service";
import { PrismaShoppingListRepository } from "../Infrastructure/Repositories/PrismaShoppingListRepository";

const shoppingListService = new ShoppingListService(new PrismaShoppingListRepository());

export const listUserShoppingList = async () => {
  try {
    const lists = await shoppingListService.listUserShoppingLists();
    return lists.map((list) => list.toObject());
  } catch (error) {
    console.error("Error listing user shopping lists", error);
    throw new Error("Failed to retrieve shopping lists");
  }
};

export const getShoppingList = async (id: string): Promise<ShoppingList | null> => {
  try {
    const list = await shoppingListService.getShoppingList(id);
    return list ? list : null;
  } catch (error) {
    console.error("Error retrieving shopping list", error);
    throw new Error("Failed to retrieve shopping list");
  }
};

export const createShoppingList = async (data: {
  name: string;
  description?: string | null;
  items?: Array<{
    customName?: string | null;
    quantity: number;
    unit: string;
    isCompleted?: boolean;
    price?: number | null;
  }>;
}) => {
  try {
    const list = await shoppingListService.createShoppingList(data);
    return list.toObject();
  } catch (error) {
    console.error("Error creating shopping list", error);
    throw new Error("Failed to create shopping list");
  }
};

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
    const item = await shoppingListService.addItemToList(listId, itemData);
    return item.toObject();
  } catch (error) {
    console.error("Error adding item to list", error);
    throw new Error("Failed to add item to list");
  }
};

export const updateListItem = async (
  itemId: string,
  data: {
    customName?: string | null;
    quantity?: number;
    unit?: string;
    isCompleted?: boolean;
    price?: number | null;
    notes?: string | null;
  }
) => {
  try {
    const item = await shoppingListService.updateShoppingListItem(itemId, data);
    return item.toObject();
  } catch (error) {
    console.error("Error updating shopping list item", error);
    throw new Error("Failed to update shopping list item");
  }
};

export const deleteShoppingList = async (id: string) => {
  try {
    await shoppingListService.deleteShoppingList(id);
    return { success: true };
  } catch (error) {
    console.error("Error deleting shopping list", error);
    throw new Error("Failed to delete shopping list");
  }
};

export const removeItemFromList = async (itemId: string) => {
  try {
    await shoppingListService.removeShoppingListItem(itemId);
    return { success: true };
  } catch (error) {
    console.error("Error removing item from list", error);
    throw new Error("Failed to remove item from list");
  }
};
