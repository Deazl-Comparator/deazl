"use server";

import { z } from "zod";

const GenerateShareLinkSchema = z.string().uuid();

type GenerateShareLinkPayload = z.infer<typeof GenerateShareLinkSchema>;

export const generateShareLink = async (shoppingListId: GenerateShareLinkPayload) => {
  try {
    const token = `token_${shoppingListId}`;

    return `${process.env.PCOMPARATOR_PUBLIC_URL}/shared/${token}`;
  } catch (error) {
    throw new Error("Failed to generate share link", { cause: error });
  }
};
