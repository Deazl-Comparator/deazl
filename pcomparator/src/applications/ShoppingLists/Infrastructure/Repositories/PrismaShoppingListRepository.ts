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

    // Fetch the complete list with items
    const completeList = await prisma.shoppingList.findUnique({
      where: { id: newList.id },
      include: { items: true }
    });

    return ShoppingListMapper.toDomain(completeList);
  }

  async findById(id: string): Promise<ShoppingList | null> {
    const list = await prisma.shoppingList.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!list) return null;

    return ShoppingListMapper.toDomain(list);
  }

  async findByUserId(userId: string): Promise<ShoppingList[]> {
    const lists = await prisma.shoppingList.findMany({
      where: { userId },
      include: { items: true },
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
}
