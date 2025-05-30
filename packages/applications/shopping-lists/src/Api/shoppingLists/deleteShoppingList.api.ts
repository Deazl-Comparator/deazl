"use server";

import { ShoppingListApplicationService } from "../../Application/Services/ShoppingList.service";
import {
  type DeleteShoppingListPayload,
  DeleteShoppingListSchema
} from "../../Domain/Schemas/ShoppingList.schema";
import { PrismaShoppingListRepository } from "../../Infrastructure/Repositories/PrismaShoppingList.infrastructure";

const shoppingListApplicationService = new ShoppingListApplicationService(new PrismaShoppingListRepository());

export const deleteShoppingList = async (shoppingListId: DeleteShoppingListPayload) => {
  try {
    const payload = DeleteShoppingListSchema.parse(shoppingListId);

    await shoppingListApplicationService.deleteShoppingList(payload);
  } catch (error) {
    throw new Error("Failed to delete shopping list", { cause: error });
  }
};
