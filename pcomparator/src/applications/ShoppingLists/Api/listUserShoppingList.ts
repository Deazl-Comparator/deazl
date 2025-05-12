"use server";

import { ShoppingListService } from "~/applications/ShoppingLists/Application/ShoppingList.service";
import { PrismaShoppingListRepository } from "~/applications/ShoppingLists/Infrastructure/Repositories/PrismaShoppingListRepository";

const shoppingListService = new ShoppingListService(new PrismaShoppingListRepository());

export const listUserShoppingList = async (): Promise<any> => {
  try {
    return (await shoppingListService.listUserShoppingLists()).map((list) => list.toObject());
  } catch (error) {
    console.error("Error listing user shopping lists", error);
    throw new Error("Shopping list not found", { cause: "FormError" });
  }
};
