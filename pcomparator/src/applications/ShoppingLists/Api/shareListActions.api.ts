"use server";

import { auth } from "~/libraries/nextauth/authConfig";
import { ShoppingListSharingApplicationService } from "../Application/Services/ShoppingListSharing.service";
import { PrismaShoppingListRepository } from "../Infrastructure/Repositories/PrismaShoppingList.infrastructure";
import { PrismaShoppingListSharingRepository } from "../Infrastructure/Repositories/PrismaShoppingListSharing.infrastructure";

const shoppingListSharingService = new ShoppingListSharingApplicationService(
  new PrismaShoppingListRepository(),
  new PrismaShoppingListSharingRepository()
);

export async function generateShareLink(listId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  // TODO: Implementer la génération de tokens dans ShoppingListSharingApplicationService
  const token = `token_${listId}`;
  return `${process.env.PCOMPARATOR_PUBLIC_URL}/shared/${token}`;
}

export async function addCollaborator(listId: string, email: string, role: "EDITOR" | "VIEWER") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await shoppingListSharingService.shareList(listId, email, role);
  return { success: true };
}

export async function getCollaborators(listId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  return shoppingListSharingService.getListCollaborators(listId);
}

export async function removeCollaborator(listId: string, userId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await shoppingListSharingService.removeCollaborator(listId, userId);
  return { success: true };
}
