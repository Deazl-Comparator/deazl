import type { ShoppingList } from "~/ShoppingLists/Domain/Entities/ShoppingList.entity";
import type { ShoppingListRepository } from "~/ShoppingLists/Domain/Repositories/ShoppingListRepository";
import { ShoppingListMapper } from "~/ShoppingLists/Infrastructure/Mappers/ShoppingListMapper";
import { prisma } from "~/libraries/prisma";

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
      include: {
        items: true,
        collaborators: {
          include: {
            user: true
          }
        }
      }
    });

    return ShoppingListMapper.toDomain(updatedList);
  }

  async delete(id: string): Promise<void> {
    // Delete items first (assuming cascade delete is not set up)
    await prisma.shoppingListItem.deleteMany({
      where: { shoppingListId: id }
    });

    // Delete collaborators
    await prisma.shoppingListCollaborator.deleteMany({
      where: { listId: id }
    });

    await prisma.shoppingList.delete({
      where: { id }
    });
  }
}
