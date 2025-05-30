"use server";

import { z } from "zod";
import { ShoppingListApplicationService } from "../../Application/Services/ShoppingList.service";
import { PrismaShoppingListRepository } from "../../Infrastructure/Repositories/PrismaShoppingList.infrastructure";

const shoppingListApplicationService = new ShoppingListApplicationService(new PrismaShoppingListRepository());

const DeleteShoppingListSchema = z.string().uuid();

type DeleteShoppingListPayload = z.infer<typeof DeleteShoppingListSchema>;

export const deleteShoppingList = async (shoppingListId: DeleteShoppingListPayload) => {
  try {
    const payload = DeleteShoppingListSchema.parse(shoppingListId);

    await shoppingListApplicationService.deleteShoppingList(payload);
  } catch (error) {
    throw new Error("Failed to delete shopping list", { cause: error });
  }
};
