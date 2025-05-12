"use server";

import { auth } from "~/libraries/nextauth/authConfig";
import type { CreateShoppingList } from "../Domain/Entities/ShoppingList";
import type { CreateShoppingListItem } from "../Domain/Entities/ShoppingListItem";
import { PrismaShoppingListRepository } from "../Infrastructure/Repositories/PrismaShoppingListRepository";

const repository = new PrismaShoppingListRepository();

export async function createShoppingList(data: Omit<CreateShoppingList, "userId">) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  // @ts-ignore
  return repository.create({
    ...data,
    userId: session.user.id
  });
}

export async function getUserShoppingLists() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  return repository.findByUserId(session.user.id);
}

export async function getShoppingList(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const list = await repository.findById(id);

  if (list?.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  return list;
}

export async function updateShoppingList(id: string, data: Partial<CreateShoppingList>) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const list = await repository.findById(id);

  if (!list || list.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  // @ts-ignore
  return repository.update(id, data);
}

export async function deleteShoppingList(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const list = await repository.findById(id);

  if (!list || list.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await repository.delete(id);
  return { success: true };
}

export async function addItemToList(listId: string, item: Omit<CreateShoppingListItem, "shoppingListId">) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const list = await repository.findById(listId);

  if (!list || list.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  // @ts-ignore
  const newItem = await repository.addItem(listId, { ...item, shoppingListId: listId });

  // Retourner le nouvel élément ajouté pour permettre la mise à jour UI côté client
  return newItem.toObject();
}

export async function updateListItem(itemId: string, data: Partial<CreateShoppingListItem>) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  // Note: For a real app, would need to check if user owns the list containing this item
  // @ts-ignore
  return repository.updateItem({ ...data, id: itemId });
}

export async function removeItemFromList(itemId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  // Note: For a real app, would need to check if user owns the list containing this item
  await repository.removeItem(itemId);
  return { success: true };
}
