"use server";

import { ShoppingListApplicationService } from "../../Application/Services/ShoppingList.service";
import type { ShoppingListPayload } from "../../Domain/Entities/ShoppingList.entity";
import { PrismaShoppingListRepository } from "../../Infrastructure/Repositories/PrismaShoppingList.infrastructure";

const shoppingListApplicationService = new ShoppingListApplicationService(new PrismaShoppingListRepository());

export const listUserShoppingList = async (): Promise<ShoppingListPayload[] | null> => {
  try {
    const userShoppingLists = await shoppingListApplicationService.listUserShoppingLists();

    return userShoppingLists.map((shoppingList) => shoppingList.toObject());
  } catch (error) {
    throw new Error("Shopping list not found", { cause: error });
  }
};
