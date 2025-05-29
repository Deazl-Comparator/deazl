"use server";

import { z } from "zod";
import { ShoppingListApplicationService } from "~/Application/Services/ShoppingList.service";
import type { ShoppingListPayload } from "~/Domain/Entities/ShoppingList.entity";
import { PrismaShoppingListRepository } from "~/Infrastructure/Repositories/PrismaShoppingList.infrastructure";

const shoppingListApplicationService = new ShoppingListApplicationService(new PrismaShoppingListRepository());

export const CreateShoppingListSchema = z.object({
  name: z.string(),
  description: z.string().optional()
});

export type CreateShoppingListPayload = z.infer<typeof CreateShoppingListSchema>;

export const createShoppingList = async (params: CreateShoppingListPayload): Promise<ShoppingListPayload> => {
  try {
    const payload = CreateShoppingListSchema.parse(params);

    const list = await shoppingListApplicationService.createShoppingList(payload);

    return list.toObject();
  } catch (error) {
    throw new Error("Failed to create shopping list", { cause: error });
  }
};
