"use server";

import { ShoppingListSharingApplicationService } from "../../../Application/Services/ShoppingListSharing.service";
import {
  type AddCollaboratorPayload,
  AddCollaboratorSchema
} from "../../../Domain/Schemas/ShoppingListSharing.schema";
import { PrismaShoppingListRepository } from "../../../Infrastructure/Repositories/PrismaShoppingList.infrastructure";
import { PrismaShoppingListSharingRepository } from "../../../Infrastructure/Repositories/PrismaShoppingListSharing.infrastructure";

const shoppingListSharingService = new ShoppingListSharingApplicationService(
  new PrismaShoppingListRepository(),
  new PrismaShoppingListSharingRepository()
);

export async function addCollaborator(params: AddCollaboratorPayload): Promise<void> {
  try {
    const payload = AddCollaboratorSchema.parse(params);

    await shoppingListSharingService.shareList(payload);
  } catch (error) {
    throw new Error("Failed to add collaborator", { cause: error });
  }
}
