"use server";

import { redirect } from "next/navigation";
import { createShoppingList } from "~/applications/ShoppingLists/Actions/shoppingListActions";

export async function handleCreateList(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const itemsJson = formData.get("items") as string;

  if (!name) {
    return { error: "Name is required" };
  }

  let items = [];
  if (itemsJson) {
    try {
      items = JSON.parse(itemsJson);
    } catch (error) {
      console.error("Error parsing items:", error);
    }
  }

  const list = await createShoppingList({
    name,
    description: description || null,
    items: items.map((item) => ({
      customName: item.customName,
      quantity: item.quantity,
      unit: item.unit,
      isCompleted: false
    }))
  });

  redirect(`/shopping-lists/${list.id}`);
}
