"use server";

import { z } from "zod";
import { ShoppingListApplicationService } from "~/ShoppingLists/Application/Services/ShoppingList.service";
import type { ShoppingList } from "~/ShoppingLists/Domain/Entities/ShoppingList.entity";
import { PrismaShoppingListRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingList.infrastructure";

const shoppingListApplicationService = new ShoppingListApplicationService(new PrismaShoppingListRepository());

export const GetShoppingListSchema = z.string().uuid();

export type GetShoppingListPayload = z.infer<typeof GetShoppingListSchema>;

export const getShoppingList = async (
  shoppingListId: GetShoppingListPayload
): Promise<ShoppingList | null> => {
  try {
    const payload = GetShoppingListSchema.parse(shoppingListId);

    const list = await shoppingListApplicationService.getShoppingList(payload);

    return list;
  } catch (error) {
    throw new Error("Failed to retrieve shopping list", { cause: error });
  }
};
