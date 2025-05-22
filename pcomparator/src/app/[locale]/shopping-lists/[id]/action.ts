"use server";

import { removeItemFromList } from "~/applications/ShoppingLists/Actions/shoppingListActions";

export async function deleteItem(itemId: string) {
  try {
    await removeItemFromList(itemId);
    return { success: true };
  } catch (error) {
    console.error("Server error deleting item:", error);
    throw new Error("Failed to delete item");
  }
}
