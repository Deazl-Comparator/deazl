import { prisma } from "~/libraries/prisma";
import type { CreateShoppingList, ShoppingList } from "../../Domain/Entities/ShoppingList";
import type { CreateShoppingListItem, ShoppingListItem } from "../../Domain/Entities/ShoppingListItem";
import type { ShoppingListRepository } from "../../Domain/Repositories/ShoppingListRepository";

export class PrismaShoppingListRepository implements ShoppingListRepository {
  async create(data: CreateShoppingList): Promise<ShoppingList> {
    const { items, ...shoppingListData } = data;

    const newList = await prisma.shoppingList.create({
      data: {
        name: shoppingListData.name,
        description: shoppingListData.description ?? null,
        userId: shoppingListData.userId,
        items: items
          ? {
              create: items.map((item) => ({
                quantity: item.quantity,
                unit: item.unit,
                customName: item.customName,
                productId: item.productId ?? null,
                isCompleted: item.isCompleted ?? false
              }))
            }
          : undefined
      },
      include: {
        items: true
      }
    });

    return {
      id: newList.id,
      name: newList.name,
      description: newList.description,
      userId: newList.userId,
      createdAt: newList.createdAt,
      updatedAt: newList.updatedAt,
      items: newList.items.map((item) => ({
        id: item.id,
        shoppingListId: item.shoppingListId,
        productId: item.productId,
        quantity: item.quantity,
        unit: item.unit as any,
        isCompleted: item.isCompleted,
        customName: item.customName,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }))
    };
  }

  async findById(id: string): Promise<ShoppingList | null> {
    const list = await prisma.shoppingList.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!list) return null;

    return {
      id: list.id,
      name: list.name,
      description: list.description,
      userId: list.userId,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
      items: list.items.map((item) => ({
        id: item.id,
        shoppingListId: item.shoppingListId,
        productId: item.productId,
        quantity: item.quantity,
        unit: item.unit as any,
        isCompleted: item.isCompleted,
        customName: item.customName,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }))
    };
  }

  async findByUserId(userId: string): Promise<ShoppingList[]> {
    const lists = await prisma.shoppingList.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { updatedAt: "desc" }
    });

    return lists.map((list) => ({
      id: list.id,
      name: list.name,
      description: list.description,
      userId: list.userId,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
      items: list.items.map((item) => ({
        id: item.id,
        shoppingListId: item.shoppingListId,
        productId: item.productId,
        quantity: item.quantity,
        unit: item.unit as any,
        isCompleted: item.isCompleted,
        customName: item.customName,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }))
    }));
  }

  async update(id: string, data: Partial<CreateShoppingList>): Promise<ShoppingList> {
    const { items, ...updateData } = data;

    const updatedList = await prisma.shoppingList.update({
      where: { id },
      data: updateData,
      include: { items: true }
    });

    return {
      id: updatedList.id,
      name: updatedList.name,
      description: updatedList.description,
      userId: updatedList.userId,
      createdAt: updatedList.createdAt,
      updatedAt: updatedList.updatedAt,
      items: updatedList.items.map((item) => ({
        id: item.id,
        shoppingListId: item.shoppingListId,
        productId: item.productId,
        quantity: item.quantity,
        unit: item.unit as any,
        isCompleted: item.isCompleted,
        customName: item.customName,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }))
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.shoppingList.delete({
      where: { id }
    });
  }

  async addItem(shoppingListId: string, item: CreateShoppingListItem): Promise<ShoppingListItem> {
    const newItem = await prisma.shoppingListItem.create({
      data: {
        shoppingListId,
        productId: item.productId ?? null,
        quantity: item.quantity,
        unit: item.unit,
        isCompleted: item.isCompleted ?? false,
        customName: item.customName
      }
    });

    return {
      id: newItem.id,
      shoppingListId: newItem.shoppingListId,
      productId: newItem.productId,
      quantity: newItem.quantity,
      unit: newItem.unit as any,
      isCompleted: newItem.isCompleted,
      customName: newItem.customName,
      createdAt: newItem.createdAt,
      updatedAt: newItem.updatedAt
    };
  }

  async updateItem(id: string, data: Partial<CreateShoppingListItem>): Promise<ShoppingListItem> {
    const updatedItem = await prisma.shoppingListItem.update({
      where: { id },
      data
    });

    return {
      id: updatedItem.id,
      shoppingListId: updatedItem.shoppingListId,
      productId: updatedItem.productId,
      quantity: updatedItem.quantity,
      unit: updatedItem.unit as any,
      isCompleted: updatedItem.isCompleted,
      customName: updatedItem.customName,
      createdAt: updatedItem.createdAt,
      updatedAt: updatedItem.updatedAt
    };
  }

  async removeItem(id: string): Promise<void> {
    await prisma.shoppingListItem.delete({
      where: { id }
    });
  }
}
