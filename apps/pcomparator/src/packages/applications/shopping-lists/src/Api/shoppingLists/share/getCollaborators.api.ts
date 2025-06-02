"use server";

import { ShoppingListSharingApplicationService } from "../../../Application/Services/ShoppingListSharing.service";
import {
  type GetCollaboratorsPayload,
  GetCollaboratorsSchema
} from "../../../Domain/Schemas/ShoppingListSharing.schema";
import { PrismaShoppingListRepository } from "../../../Infrastructure/Repositories/PrismaShoppingList.infrastructure";
import { PrismaShoppingListSharingRepository } from "../../../Infrastructure/Repositories/PrismaShoppingListSharing.infrastructure";

const shoppingListSharingService = new ShoppingListSharingApplicationService(
  new PrismaShoppingListRepository(),
  new PrismaShoppingListSharingRepository()
);

export async function getCollaborators(shoppingListId: GetCollaboratorsPayload) {
  try {
    const payload = GetCollaboratorsSchema.parse(shoppingListId);

    return shoppingListSharingService.getListCollaborators(payload);
  } catch (error) {
    throw new Error("Failed to retrieve collaborators", { cause: error });
  }
}
