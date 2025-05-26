"use server";

import { ShoppingListApplicationService } from "../Application/Services/ShoppingList.service";
import { PrismaShoppingListRepository } from "../Infrastructure/Repositories/PrismaShoppingList.infrastructure";

const shoppingListApplicationService = new ShoppingListApplicationService(new PrismaShoppingListRepository());

export const createShoppingList = async (data: {
  name: string;
  description?: string | null;
  items?: Array<{
    customName?: string | null;
    quantity: number;
    unit: string;
    isCompleted?: boolean;
    price?: number | null;
  }>;
}) => {
  try {
    const list = await shoppingListApplicationService.createShoppingList(data);
    return list.toObject();
  } catch (error) {
    console.error("Error creating shopping list", error);
    throw new Error("Failed to create shopping list");
  }
};
