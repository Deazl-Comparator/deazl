"use server";

import { ShoppingListApplicationService } from "~/ShoppingLists/Application/Services/ShoppingList.service";
import type { ShoppingList } from "~/ShoppingLists/Domain/Entities/ShoppingList.entity";
import { PrismaShoppingListRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingList.infrastructure";

const shoppingListApplicationService = new ShoppingListApplicationService(new PrismaShoppingListRepository());

export const getShoppingList = async (id: string): Promise<ShoppingList | null> => {
  try {
    const list = await shoppingListApplicationService.getShoppingList(id);

    return list;
  } catch (error) {
    console.error("Error retrieving shopping list", error);
    throw new Error("Failed to retrieve shopping list");
  }
};
