"use server";

import { removeItemFromList, updateListItem } from "~/applications/ShoppingLists/Actions/shoppingListActions";

export async function toggleItemComplete(itemId: string, isCompleted: boolean) {
  await updateListItem(itemId, { isCompleted });
}

export async function deleteItem(itemId: string) {
  await removeItemFromList(itemId);
}