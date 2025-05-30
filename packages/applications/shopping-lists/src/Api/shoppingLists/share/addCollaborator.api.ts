"use server";

import { z } from "zod";
import { ShoppingListSharingApplicationService } from "../../../Application/Services/ShoppingListSharing.service";
import { PrismaShoppingListRepository } from "../../../Infrastructure/Repositories/PrismaShoppingList.infrastructure";
import { PrismaShoppingListSharingRepository } from "../../../Infrastructure/Repositories/PrismaShoppingListSharing.infrastructure";

const shoppingListSharingService = new ShoppingListSharingApplicationService(
  new PrismaShoppingListRepository(),
  new PrismaShoppingListSharingRepository()
);

const AddCollaboratorSchema = z.object({
  shoppingListId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["EDITOR", "VIEWER"])
});

type AddCollaboratorPayload = z.infer<typeof AddCollaboratorSchema>;

export async function addCollaborator(params: AddCollaboratorPayload): Promise<void> {
  try {
    const payload = AddCollaboratorSchema.parse(params);

    await shoppingListSharingService.shareList(payload.shoppingListId, payload.email, payload.role);
  } catch (error) {
    throw new Error("Failed to add collaborator", { cause: error });
  }
}
