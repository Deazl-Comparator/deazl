"use server";

import { ShoppingListSharingApplicationService } from "../../../Application/Services/ShoppingListSharing.service";
import {
  type RemoveCollaboratorPayload,
  RemoveCollaboratorSchema
} from "../../../Domain/Schemas/ShoppingListSharing.schema";
import { PrismaShoppingListRepository } from "../../../Infrastructure/Repositories/PrismaShoppingList.infrastructure";
import { PrismaShoppingListSharingRepository } from "../../../Infrastructure/Repositories/PrismaShoppingListSharing.infrastructure";

const shoppingListSharingService = new ShoppingListSharingApplicationService(
  new PrismaShoppingListRepository(),
  new PrismaShoppingListSharingRepository()
);

export async function removeCollaborator(params: RemoveCollaboratorPayload): Promise<void> {
  try {
    const { listId, userId } = RemoveCollaboratorSchema.parse(params);

    await shoppingListSharingService.removeCollaborator(listId, userId);
  } catch (error) {
    throw new Error("Failed to remove collaborator", { cause: error });
  }
}
