"use server";

import { z } from "zod";
import { ShoppingListApplicationService } from "~/ShoppingLists/Application/Services/ShoppingList.service";
import { PrismaShoppingListRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingList.infrastructure";

const shoppingListApplicationService = new ShoppingListApplicationService(new PrismaShoppingListRepository());

export const DeleteShoppingListSchema = z.string().uuid();

export type DeleteShoppingListPayload = z.infer<typeof DeleteShoppingListSchema>;

export const deleteShoppingList = async (shoppingListId: DeleteShoppingListPayload) => {
  try {
    const payload = DeleteShoppingListSchema.parse(shoppingListId);

    await shoppingListApplicationService.deleteShoppingList(payload);
  } catch (error) {
    throw new Error("Failed to delete shopping list", { cause: error });
  }
};
