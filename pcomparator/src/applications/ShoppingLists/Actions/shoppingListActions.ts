"use server";

import type { CreateShoppingListUseCase } from "~/applications/ShoppingLists/Application/UseCases/CreateShoppingList.usecase";
import { CollaboratorRole } from "~/applications/ShoppingLists/Domain/Entities/ShoppingListCollaborator.entity";
import { auth } from "~/libraries/nextauth/authConfig";
import { PrismaShoppingListRepository } from "../Infrastructure/Repositories/PrismaShoppingListRepository";

const repository = new PrismaShoppingListRepository();

export async function createShoppingList(data: Omit<any, "userId">) {
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
  if (!list) return null;

  if (list.userId !== session.user.id) {
    const collaborators = await repository.getCollaborators(id);

    if (!collaborators.some((c) => c.userId === session.user.id)) throw new Error("Unauthorized");
  }

  return list;
}

export async function updateShoppingList(id: string, data: Partial<CreateShoppingListUseCase>) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const list = await repository.findById(id);
  if (!list) throw new Error("List not found");

  if (list.userId !== session.user.id) {
    const collaborators = await repository.getCollaborators(id);
    const userRole = collaborators.find((c) => c.userId === session.user.id)?.role;

    if (!userRole || userRole === CollaboratorRole.VIEWER)
      throw new Error("You need edit rights to modify this list");
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

export async function addItemToList(listId: string, item: Omit<any, "shoppingListId">) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const list = await repository.findById(listId);

  if (!list) throw new Error("List not found");

  if (list.userId !== session.user.id) {
    const collaborators = await repository.getCollaborators(listId);
    const userRole = collaborators.find((c) => c.userId === session.user.id)?.role;

    if (!userRole || userRole === CollaboratorRole.VIEWER)
      throw new Error("You need edit rights to modify this list");
  }

  // @ts-ignore
  const newItem = await repository.addItem(listId, { ...item, shoppingListId: listId });

  return newItem.toObject();
}

export async function updateListItem(itemId: string, data: Partial<any>) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const item = await repository.findItemById(itemId);
  if (!item) throw new Error("Item not found");

  const list = await repository.findById(item.shoppingListId);
  if (!list) throw new Error("List not found");

  if (list.userId !== session.user.id) {
    const collaborators = await repository.getCollaborators(list.id);
    const userRole = collaborators.find((c) => c.userId === session.user.id)?.role;

    if (!userRole || userRole === CollaboratorRole.VIEWER)
      throw new Error("You need edit rights to modify this list");
  }

  // @ts-ignore
  return repository.updateItem({ ...data, id: itemId });
}

export async function removeItemFromList(itemId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const item = await repository.findItemById(itemId);
  if (!item) throw new Error("Item not found");

  const list = await repository.findById(item.shoppingListId);
  if (!list) throw new Error("List not found");

  if (list.userId !== session.user.id) {
    const collaborators = await repository.getCollaborators(list.id);
    const userRole = collaborators.find((c) => c.userId === session.user.id)?.role;

    if (!userRole || userRole === CollaboratorRole.VIEWER)
      throw new Error("You need edit rights to modify this list");
  }

  await repository.removeItem(itemId);
  return { success: true };
}
