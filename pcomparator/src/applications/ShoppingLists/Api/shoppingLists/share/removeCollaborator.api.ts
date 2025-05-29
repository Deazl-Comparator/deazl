"use server";

import { z } from "zod";
import { ShoppingListSharingApplicationService } from "~/ShoppingLists/Application/Services/ShoppingListSharing.service";
import { PrismaShoppingListRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingList.infrastructure";
import { PrismaShoppingListSharingRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingListSharing.infrastructure";

const shoppingListSharingService = new ShoppingListSharingApplicationService(
  new PrismaShoppingListRepository(),
  new PrismaShoppingListSharingRepository()
);

export const RemoveCollaboratorSchema = z.object({
  listId: z.string().uuid(),
  userId: z.string().uuid()
});

export type RemoveCollaboratorPayload = z.infer<typeof RemoveCollaboratorSchema>;

export async function removeCollaborator(params: RemoveCollaboratorPayload): Promise<void> {
  try {
    const { listId, userId } = RemoveCollaboratorSchema.parse(params);

    await shoppingListSharingService.removeCollaborator(listId, userId);
  } catch (error) {
    throw new Error("Failed to remove collaborator", { cause: error });
  }
}
