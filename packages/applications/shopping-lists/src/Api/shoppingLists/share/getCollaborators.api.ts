"use server";

import { z } from "zod";
import { ShoppingListSharingApplicationService } from "../../../Application/Services/ShoppingListSharing.service";
import { PrismaShoppingListRepository } from "../../../Infrastructure/Repositories/PrismaShoppingList.infrastructure";
import { PrismaShoppingListSharingRepository } from "../../../Infrastructure/Repositories/PrismaShoppingListSharing.infrastructure";

const shoppingListSharingService = new ShoppingListSharingApplicationService(
  new PrismaShoppingListRepository(),
  new PrismaShoppingListSharingRepository()
);

export const GetCollaboratorsSchema = z.string().uuid();

export type GetCollaboratorsPayload = z.infer<typeof GetCollaboratorsSchema>;

export async function getCollaborators(shoppingListId: GetCollaboratorsPayload) {
  try {
    const payload = GetCollaboratorsSchema.parse(shoppingListId);

    return shoppingListSharingService.getListCollaborators(payload);
  } catch (error) {
    throw new Error("Failed to retrieve collaborators", { cause: error });
  }
}
