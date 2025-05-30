"use server";

import {
  type GenerateShareLinkPayload,
  GenerateShareLinkSchema
} from "../../../Domain/Schemas/ShoppingListSharing.schema";

export const generateShareLink = async (shoppingListId: GenerateShareLinkPayload) => {
  try {
    const payload = GenerateShareLinkSchema.parse(shoppingListId);
    const token = `token_${payload}`;

    return `${process.env.PCOMPARATOR_PUBLIC_URL}/shared/${token}`;
  } catch (error) {
    throw new Error("Failed to generate share link", { cause: error });
  }
};
