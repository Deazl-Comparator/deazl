"use server";
import { auth } from "~/libraries/nextauth/authConfig";
import { ShoppingListService } from "../Application/ShoppingList.service";
import { PrismaShoppingListRepository } from "../Infrastructure/Repositories/PrismaShoppingListRepository";

const shoppingListService = new ShoppingListService(new PrismaShoppingListRepository());

export async function createProductFromItem(data: {
  name: string;
  price: number;
  unit: string;
  quantity: number;
  brandName: string;
  storeName: string;
  storeLocation: string;
  referencePrice: number;
  referenceUnit: string;
}): Promise<any> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const result = await shoppingListService.createProductFromItem(data);
    return result;
  } catch (error) {
    console.error("Error creating product from item:", error);
    throw new Error("Failed to create product", { cause: "FormError" });
  }
}
