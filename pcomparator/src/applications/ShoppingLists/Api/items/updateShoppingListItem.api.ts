"use server";

import { z } from "zod";
import { ShoppingListItemApplicationService } from "~/ShoppingLists/Application/Services/ShoppingListItem.service";
import type { ShoppingListItemPayload } from "~/ShoppingLists/Domain/Entities/ShoppingListItem.entity";
import { ItemQuantity } from "~/ShoppingLists/Domain/ValueObjects/ItemQuantity.vo";
import { Price } from "~/ShoppingLists/Domain/ValueObjects/Price.vo";
import { Unit } from "~/ShoppingLists/Domain/ValueObjects/Unit.vo";
import { PrismaShoppingListRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingList.infrastructure";
import { PrismaShoppingListItemRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingListItem.infrastructure";

const shoppingListItemService = new ShoppingListItemApplicationService(
  new PrismaShoppingListRepository(),
  new PrismaShoppingListItemRepository()
);

export const UpdateShoppingListItemSchema = z.object({
  itemId: z.string().uuid(),
  data: z
    .object({
      customName: z.string().min(2, "Item name must be at least 2 characters long").optional(),
      quantity: z.number().positive("Quantity must be positive").optional(),
      unit: z.enum(["unit", "kg", "g", "l", "ml", "piece"]).optional(),
      price: z.number().min(0, "Price cannot be negative").nullable().optional(),
      isCompleted: z.boolean().optional(),
      barcode: z.string().nullable().optional()
    })
    .partial()
});

export type UpdateShoppingListItemPayload = z.infer<typeof UpdateShoppingListItemSchema>;

export const updateShoppingListItem = async (
  itemId: string,
  data: Partial<
    Pick<ShoppingListItemPayload, "customName" | "quantity" | "unit" | "price" | "isCompleted" | "barcode">
  >
): Promise<ShoppingListItemPayload> => {
  try {
    const payload = UpdateShoppingListItemSchema.parse({ itemId, data });

    // Validation et création des Value Objects pour les champs modifiés
    const validatedData: Partial<
      Pick<ShoppingListItemPayload, "customName" | "quantity" | "unit" | "price" | "isCompleted" | "barcode">
    > = {};

    if (payload.data.customName !== undefined) {
      validatedData.customName = payload.data.customName;
    }

    if (payload.data.quantity !== undefined) {
      const quantity = ItemQuantity.create(payload.data.quantity);
      validatedData.quantity = quantity.value;
    }

    if (payload.data.unit !== undefined) {
      const unit = Unit.create(payload.data.unit);
      validatedData.unit = unit.value;
    }

    if (payload.data.price !== undefined) {
      const price = Price.createOptional(payload.data.price);
      validatedData.price = price?.value ?? undefined;
    }

    if (payload.data.isCompleted !== undefined) {
      validatedData.isCompleted = payload.data.isCompleted;
    }

    if (payload.data.barcode !== undefined) {
      validatedData.barcode = payload.data.barcode;
    }

    const updatedItem = await shoppingListItemService.updateShoppingListItem(payload.itemId, validatedData);

    return updatedItem.toObject();
  } catch (error) {
    throw new Error("Failed to update shopping list item", { cause: error });
  }
};
