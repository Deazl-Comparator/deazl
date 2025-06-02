"use server";

import { auth, prisma } from "@deazl/system";

interface CreateStoreParams {
  name: string;
  location: string;
}

export async function createStore(params: CreateStoreParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    // Vérifier si le magasin existe déjà
    const existingStore = await prisma.store.findFirst({
      where: {
        name: params.name,
        location: params.location
      }
    });

    if (existingStore) {
      return existingStore;
    }

    // Créer un nouveau magasin
    const newStore = await prisma.store.create({
      data: {
        name: params.name,
        location: params.location
      }
    });

    return newStore;
  } catch (error) {
    console.error("Error creating store:", error);
    throw new Error("Failed to create store");
  }
}
