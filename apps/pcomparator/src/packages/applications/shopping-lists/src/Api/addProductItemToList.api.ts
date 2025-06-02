"use server";

import { ShoppingListItemApplicationService } from "../Application/Services/ShoppingListItem.service";
import { ItemQuantity } from "../Domain/ValueObjects/ItemQuantity.vo";
import { Price } from "../Domain/ValueObjects/Price.vo";
import { Unit } from "../Domain/ValueObjects/Unit.vo";
import { PrismaShoppingListRepository } from "../Infrastructure/Repositories/PrismaShoppingList.infrastructure";
import { PrismaShoppingListItemRepository } from "../Infrastructure/Repositories/PrismaShoppingListItem.infrastructure";

const shoppingListItemService = new ShoppingListItemApplicationService(
  new PrismaShoppingListRepository(),
  new PrismaShoppingListItemRepository()
);

export interface AddProductItemData {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  price?: number | null;
  customName?: string | null;
  isCompleted?: boolean;
}

export const addProductItemToList = async (listId: string, itemData: AddProductItemData) => {
  try {
    const quantity = ItemQuantity.create(itemData.quantity);
    const unit = Unit.create(itemData.unit);
    const price = Price.createOptional(itemData.price);

    const itemName = itemData.customName || itemData.productName;
    if (itemName && itemName.trim().length < 2)
      throw new Error("Item name must be at least 2 characters long");

    const item = await shoppingListItemService.addItemToList(listId, {
      productId: itemData.productId,
      customName: itemName,
      quantity: quantity.value,
      unit: unit.value,
      price: price?.value ?? undefined,
      isCompleted: itemData.isCompleted || false
    });

    return item.toObject();
  } catch (error) {
    console.error("Error adding product item to list", error);

    if (error instanceof Error && error.message.includes("Quantity must be at least"))
      throw new Error(`Invalid quantity: ${error.message}`);

    if (error instanceof Error && error.message.includes("Price cannot be negative"))
      throw new Error(`Invalid price: ${error.message}`);

    if (error instanceof Error && error.message.includes("Unit"))
      throw new Error(`Invalid unit: ${error.message}`);

    throw new Error("Failed to add product item to list");
  }
};
