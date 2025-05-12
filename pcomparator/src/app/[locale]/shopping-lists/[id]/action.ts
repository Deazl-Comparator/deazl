"use server";

import { removeItemFromList, updateListItem } from "~/applications/ShoppingLists/Actions/shoppingListActions";
import type { ShoppingListItem } from "~/applications/ShoppingLists/Domain/Entities/ShoppingListItem";

export async function toggleItemComplete(itemId: string, isCompleted: boolean) {
  try {
    // Mettre à jour l'état de l'item dans la base de données
    await updateListItem(itemId, { isCompleted });
    return { success: true };
  } catch (error) {
    console.error("Server error toggling item completion:", error);
    throw new Error("Failed to update item status");
  }
}

export async function updateItem(itemId: string, data: Partial<ShoppingListItem>) {
  try {
    // S'assurer que les champs sont bien formatés pour Prisma
    const prismaData: any = {};

    if (data.customName !== undefined) prismaData.customName = data.customName;
    if (data.quantity !== undefined) prismaData.quantity = data.quantity;
    if (data.unit !== undefined) prismaData.unit = data.unit;
    if (data.isCompleted !== undefined) prismaData.isCompleted = data.isCompleted;

    // Gestion spéciale pour le prix qui peut être null
    if ("price" in data) {
      prismaData.price = data.price === null ? null : data.price;
    }

    await updateListItem(itemId, prismaData);
    return { success: true };
  } catch (error) {
    console.error("Server error updating item:", error);
    throw new Error("Failed to update item");
  }
}

export async function deleteItem(itemId: string) {
  try {
    await removeItemFromList(itemId);
    return { success: true };
  } catch (error) {
    console.error("Server error deleting item:", error);
    throw new Error("Failed to delete item");
  }
}
