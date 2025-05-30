"use server";

import { ShoppingListApplicationService } from "../../Application/Services/ShoppingList.service";
import {
  type CreateShoppingListPayload,
  CreateShoppingListSchema,
  type ShoppingListPayload
} from "../../Domain/Schemas/ShoppingList.schema";
import { PrismaShoppingListRepository } from "../../Infrastructure/Repositories/PrismaShoppingList.infrastructure";

const shoppingListApplicationService = new ShoppingListApplicationService(new PrismaShoppingListRepository());

export const createShoppingList = async (params: CreateShoppingListPayload): Promise<ShoppingListPayload> => {
  try {
    const payload = CreateShoppingListSchema.parse(params);

    const list = await shoppingListApplicationService.createShoppingList(payload);

    return list.toObject();
  } catch (error) {
    throw new Error("Failed to create shopping list", { cause: error });
  }
};
