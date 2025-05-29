"use server";

import { z } from "zod";
import { ShoppingListSharingApplicationService } from "~/ShoppingLists/Application/Services/ShoppingListSharing.service";
import { PrismaShoppingListRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingList.infrastructure";
import { PrismaShoppingListSharingRepository } from "~/ShoppingLists/Infrastructure/Repositories/PrismaShoppingListSharing.infrastructure";

const shoppingListSharingService = new ShoppingListSharingApplicationService(
  new PrismaShoppingListRepository(),
  new PrismaShoppingListSharingRepository()
);

export const AddCollaboratorSchema = z.object({
  shoppingListId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["EDITOR", "VIEWER"])
});

export type AddCollaboratorPayload = z.infer<typeof AddCollaboratorSchema>;

export async function addCollaborator(params: AddCollaboratorPayload): Promise<void> {
  try {
    const payload = AddCollaboratorSchema.parse(params);

    await shoppingListSharingService.shareList(payload.shoppingListId, payload.email, payload.role);
  } catch (error) {
    throw new Error("Failed to add collaborator", { cause: error });
  }
}
