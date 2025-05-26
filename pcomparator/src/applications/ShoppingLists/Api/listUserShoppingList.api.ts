"use server";

import { ShoppingListApplicationService } from "~/ShoppingLists/Application/Services/ShoppingList.service";
import { PrismaShoppingListRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingList.infrastructure";

const shoppingListApplicationService = new ShoppingListApplicationService(new PrismaShoppingListRepository());

export const listUserShoppingList = async (): Promise<any> => {
  try {
    return (await shoppingListApplicationService.listUserShoppingLists()).map((list) => list.toObject());
  } catch (error) {
    console.error("Error listing user shopping lists", error);
    throw new Error("Shopping list not found", { cause: "FormError" });
  }
};
