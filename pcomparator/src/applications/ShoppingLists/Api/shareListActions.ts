"use server";

import { auth } from "~/libraries/nextauth/authConfig";
import { ShoppingListService } from "../Application/ShoppingList.service";
import { PrismaShoppingListRepository } from "../Infrastructure/Repositories/PrismaShoppingListRepository";

const shoppingListService = new ShoppingListService(new PrismaShoppingListRepository());

export async function generateShareLink(listId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const token = await shoppingListService.generateShareToken(listId);
  return `${process.env.PCOMPARATOR_PUBLIC_URL}/shared/${token}`;
}

export async function addCollaborator(listId: string, email: string, role: "EDITOR" | "VIEWER") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  // @ts-ignore
  await shoppingListService.addCollaborator(listId, email, role);
  return { success: true };
}

export async function getCollaborators(listId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  return shoppingListService.getListCollaborators(listId);
}

export async function removeCollaborator(listId: string, userId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await shoppingListService.removeCollaborator(listId, userId);
  return { success: true };
}
