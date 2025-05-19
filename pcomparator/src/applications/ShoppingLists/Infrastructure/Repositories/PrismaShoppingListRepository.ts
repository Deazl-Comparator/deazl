import { v4 as uuidv4 } from "uuid";
import type {
  CollaboratorRole,
  ShoppingListCollaborator
} from "~/applications/ShoppingLists/Domain/Entities/ShoppingListCollaborator.entity";
import { ShoppingListCollaboratorMapper } from "~/applications/ShoppingLists/Infrastructure/Mappers/ShoppingListCollaboratorMapper";
import { prisma } from "~/libraries/prisma";
import type { ShoppingList } from "../../Domain/Entities/ShoppingList.entity";
import type { ShoppingListItemEntity } from "../../Domain/Entities/ShoppingListItem.entity";
import type { ShoppingListRepository } from "../../Domain/Repositories/ShoppingListRepository";
import { ShoppingListItemMapper } from "../Mappers/ShoppingListItemMapper";
import { ShoppingListMapper } from "../Mappers/ShoppingListMapper";

export class PrismaShoppingListRepository implements ShoppingListRepository {
  async create(list: ShoppingList): Promise<ShoppingList> {
    const persistenceData = ShoppingListMapper.toPersistence(list);

    const newList = await prisma.shoppingList.create({
      data: {
        name: persistenceData.name,
        description: persistenceData.description,
        userId: persistenceData.userId
      },
      include: {
        items: true
      }
    });

    console.log("New list created:", newList);

    // Add items if there are any
    if (list.items.length > 0) {
      for (const item of list.items) {
        // @ts-ignore
        const itemData = ShoppingListItemMapper.toPersistence({
          ...item,
          shoppingListId: newList.id
        });

        await prisma.shoppingListItem.create({
          data: {
            shoppingListId: newList.id,
            quantity: itemData.quantity,
            unit: itemData.unit,
            customName: itemData.customName,
            productId: itemData.productId,
            isCompleted: itemData.isCompleted,
            price: itemData.price
            // notes: itemData.notes
          }
        });
      }
    }

    console.log("New list created:", newList.id);

    // Fetch the complete list with items
    const completeList = await prisma.shoppingList.findUnique({
      where: { id: newList.id },
      include: {
        items: true,
        collaborators: {
          include: {
            user: true
          }
        }
      }
    });

    if (!completeList) {
      throw new Error("Failed to create shopping list");
    }

    return ShoppingListMapper.toDomain(completeList);
  }

  async findById(id: string): Promise<ShoppingList | null> {
    const list = await prisma.shoppingList.findUnique({
      where: { id },
      include: {
        items: true,
        collaborators: {
          include: {
            user: true
          }
        }
      }
    });

    if (!list) return null;

    return ShoppingListMapper.toDomain(list);
  }

  async findByUserId(userId: string): Promise<ShoppingList[]> {
    const lists = await prisma.shoppingList.findMany({
      where: {
        OR: [
          { userId }, // Lists owned by the user
          {
            collaborators: {
              some: {
                userId
              }
            }
          } // Lists where user is a collaborator
        ]
      },
      include: {
        items: true,
        collaborators: {
          include: {
            user: true
          }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    return lists.map((list) => ShoppingListMapper.toDomain(list));
  }

  async update(list: ShoppingList): Promise<ShoppingList> {
    const persistenceData = ShoppingListMapper.toPersistence(list);

    const updatedList = await prisma.shoppingList.update({
      where: { id: list.id },
      data: {
        name: persistenceData.name,
        description: persistenceData.description,
        updatedAt: new Date()
      },
      include: { items: true }
    });

    return ShoppingListMapper.toDomain(updatedList);
  }

  async delete(id: string): Promise<void> {
    // Delete items first (assuming cascade delete is not set up)
    await prisma.shoppingListItem.deleteMany({
      where: { shoppingListId: id }
    });

    await prisma.shoppingList.delete({
      where: { id }
    });
  }

  async addItem(listId: string, item: ShoppingListItemEntity): Promise<ShoppingListItemEntity> {
    const itemData = ShoppingListItemMapper.toPersistence(item);

    const newItem = await prisma.shoppingListItem.create({
      data: {
        shoppingListId: listId,
        productId: itemData.productId,
        quantity: itemData.quantity,
        unit: itemData.unit,
        isCompleted: itemData.isCompleted,
        customName: itemData.customName,
        price: itemData.price
        // notes: itemData.notes
      }
    });

    return ShoppingListItemMapper.toDomain(newItem);
  }

  async updateItem(item: ShoppingListItemEntity): Promise<ShoppingListItemEntity> {
    const itemData = ShoppingListItemMapper.toPersistence(item);

    const updatedItem = await prisma.shoppingListItem.update({
      where: { id: item.id },
      data: {
        quantity: itemData.quantity,
        unit: itemData.unit,
        isCompleted: itemData.isCompleted,
        customName: itemData.customName,
        price: itemData.price,
        // notes: itemData.notes,
        updatedAt: new Date()
      }
    });

    return ShoppingListItemMapper.toDomain(updatedItem);
  }

  async removeItem(itemId: string): Promise<void> {
    await prisma.shoppingListItem.delete({
      where: { id: itemId }
    });
  }

  async createProductFromItem(productInfo: {
    name: string;
    price: number;
    unit: string;
    quantity: number;
    brandName: string;
    storeName: string;
    storeLocation: string;
    referencePrice: number;
    referenceUnit: string;
  }) {
    const randomBarcode = `MANUAL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Vérifier que le prix de référence est fourni
    if (!productInfo.referencePrice) throw new Error("Reference price is required to create a product");

    // Transaction pour créer le produit, la marque, le magasin et le prix
    const result = await prisma.$transaction(async (tx) => {
      // 1. Vérifier/créer la marque
      let brand = await tx.brand.findFirst({
        where: { name: productInfo.brandName }
      });

      if (!brand) {
        brand = await tx.brand.create({
          data: {
            name: productInfo.brandName,
            description: `Brand created from shopping list item for ${productInfo.name}`
          }
        });
      }

      // 2. Vérifier/créer le magasin
      let store = await tx.store.findFirst({
        where: {
          name: productInfo.storeName,
          location: productInfo.storeLocation
        }
      });

      if (!store) {
        store = await tx.store.create({
          data: {
            name: productInfo.storeName,
            location: productInfo.storeLocation
          }
        });
      }

      // 3. Créer le produit
      const product = await tx.product.create({
        data: {
          name: productInfo.name,
          barcode: randomBarcode,
          description: "",
          brand_id: brand.id
        }
      });

      // 4. Créer l'enregistrement de prix avec le prix de référence
      const priceRecord = await tx.price.create({
        data: {
          product_id: product.id,
          store_id: store.id,
          amount: productInfo.referencePrice,
          unit: productInfo.referenceUnit,
          currency: "EUR"
        },
        include: {
          product: true,
          store: true
        }
      });

      // return {
      //   product,
      //   brand,
      //   store,
      //   priceRecord
      // };
    });

    return result;
  }

  async updatePublicStatus(listId: string, isPublic: boolean): Promise<void> {
    await prisma.shoppingList.update({
      where: { id: listId },
      data: { isPublic }
    });
  }

  async findItemById(id: string): Promise<ShoppingListItemEntity | null> {
    const item = await prisma.shoppingListItem.findUnique({
      where: { id }
    });

    if (!item) return null;

    return ShoppingListItemMapper.toDomain(item);
  }

  async generateShareToken(listId: string): Promise<string> {
    const token = uuidv4();
    await prisma.shoppingList.update({
      where: { id: listId },
      data: { shareToken: token }
    });
    return token;
  }

  async getByShareToken(token: string): Promise<ShoppingList | null> {
    const list = await prisma.shoppingList.findUnique({
      where: { shareToken: token },
      include: {
        items: true,
        collaborators: {
          include: {
            user: true
          }
        }
      }
    });

    if (!list) return null;

    return ShoppingListMapper.toDomain(list);
  }

  async findUserByEmail(email: string): Promise<{ id: string; email: string } | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true }
    });
    return user;
  }

  async addCollaborator(
    listId: string,
    email: string,
    role: CollaboratorRole
  ): Promise<ShoppingListCollaborator> {
    try {
      // First find the user by email
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }

      // Use a transaction to ensure all operations complete or none do
      const collaborator = await prisma.$transaction(async (tx) => {
        // Check if the user is already a collaborator
        const existingCollaborator = await tx.shoppingListCollaborator.findFirst({
          where: {
            listId: listId,
            userId: user.id
          }
        });

        if (existingCollaborator) {
          // If they are, update their role instead of throwing an error
          const updated = await tx.shoppingListCollaborator.update({
            where: { id: existingCollaborator.id },
            data: { role },
            include: { user: true }
          });
          return updated;
        }

        // Add the user as a collaborator if they don't exist
        return tx.shoppingListCollaborator.create({
          data: {
            id: uuidv4(),
            listId: listId,
            userId: user.id,
            role
          },
          include: {
            user: true
          }
        });
      });

      return ShoppingListCollaboratorMapper.toDomain(collaborator);
    } catch (error) {
      console.error("Error in addCollaborator:", error);
      throw error;
    }
  }

  async removeCollaborator(listId: string, userId: string): Promise<void> {
    await prisma.shoppingListCollaborator.deleteMany({
      where: {
        listId,
        userId
      }
    });
  }

  async updateCollaboratorRole(listId: string, userId: string, role: CollaboratorRole): Promise<void> {
    await prisma.shoppingListCollaborator.updateMany({
      where: {
        listId,
        userId
      },
      data: { role }
    });
  }

  async getCollaborators(listId: string): Promise<ShoppingListCollaborator[]> {
    const collaborators = await prisma.shoppingListCollaborator.findMany({
      where: { listId },
      include: { user: true }
    });

    return collaborators.map((c) => ShoppingListCollaboratorMapper.toDomain(c));
  }

  async findUserById(id: string): Promise<{ id: string; email: string } | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true
      }
    });
  }
}
