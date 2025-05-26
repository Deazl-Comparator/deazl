import { prisma } from "~/libraries/prisma";
import { ShoppingList } from "../../Domain/Entities/ShoppingList.entity";
import { ShoppingListItemEntity } from "../../Domain/Entities/ShoppingListItem.entity";
import { PrismaShoppingListRepository } from "./PrismaShoppingList.infrastructure";

jest.mock("~/libraries/prisma", () => ({
  __esModule: true,
  prisma: {
    shoppingList: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    shoppingListItem: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn()
    }
  }
}));

const shoppingListFixture = () => ({
  id: "list-123",
  name: "My Shopping List",
  description: "Test shopping list",
  userId: "user-123",
  items: [],
  collaborators: [],
  createdAt: new Date(),
  updatedAt: new Date()
});

const itemFixture = () => ({
  id: "item-123",
  shoppingListId: "list-123",
  customName: "Test Item",
  quantity: 1,
  unit: "piece",
  isCompleted: false,
  price: 10.99,
  notes: "Test notes",
  createdAt: new Date(),
  updatedAt: new Date()
});

describe("PrismaShoppingListRepository", () => {
  const repository = new PrismaShoppingListRepository();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new shopping list", async () => {
      const listData = shoppingListFixture();
      const mockCreatedList = { ...listData, items: [], collaborators: [] };

      (prisma.shoppingList.create as jest.Mock).mockResolvedValue(mockCreatedList);
      (prisma.shoppingList.findUnique as jest.Mock).mockResolvedValue(mockCreatedList);

      const list = ShoppingList.create({
        name: listData.name,
        description: listData.description,
        userId: listData.userId,
        items: []
      });

      const result = await repository.create(list);

      expect(prisma.shoppingList.create).toHaveBeenCalledWith({
        data: {
          name: listData.name,
          description: listData.description,
          userId: listData.userId
        },
        include: {
          items: true
        }
      });

      expect(result).toBeInstanceOf(ShoppingList);
      expect(result.name).toBe(listData.name);
    });

    it("should create a list with items", async () => {
      const listData = shoppingListFixture();
      const itemData = itemFixture();

      const mockCreatedList = { ...listData, items: [], collaborators: [] };
      const mockCreatedItem = { ...itemData };
      const mockCompleteList = {
        ...listData,
        items: [mockCreatedItem],
        collaborators: []
      };

      (prisma.shoppingList.create as jest.Mock).mockResolvedValue(mockCreatedList);
      (prisma.shoppingListItem.create as jest.Mock).mockResolvedValue(mockCreatedItem);
      (prisma.shoppingList.findUnique as jest.Mock).mockResolvedValue(mockCompleteList);

      const item = ShoppingListItemEntity.create({
        shoppingListId: itemData.shoppingListId,
        customName: itemData.customName,
        quantity: itemData.quantity,
        unit: itemData.unit,
        isCompleted: itemData.isCompleted,
        price: itemData.price,
        notes: itemData.notes
      });

      const list = ShoppingList.create({
        name: listData.name,
        description: listData.description,
        userId: listData.userId,
        items: [item]
      });

      console.log(list.items);
      const result = await repository.create(list);

      expect(prisma.shoppingList.create).toHaveBeenCalled();
      expect(prisma.shoppingListItem.create).toHaveBeenCalled();
      expect(result.items.length).toBe(1);
    });

    it("should throw an error if creation fails", async () => {
      (prisma.shoppingList.create as jest.Mock).mockRejectedValue(new Error("Database error"));

      const list = ShoppingList.create({
        name: "Test List",
        description: "Description",
        userId: "user-123",
        items: []
      });

      await expect(repository.create(list)).rejects.toThrow();
    });
  });

  describe("findById", () => {
    it("should find a list by id", async () => {
      const listData = shoppingListFixture();
      (prisma.shoppingList.findUnique as jest.Mock).mockResolvedValue(listData);

      const result = await repository.findById(listData.id);

      expect(prisma.shoppingList.findUnique).toHaveBeenCalledWith({
        where: { id: listData.id },
        include: {
          items: true,
          collaborators: {
            include: {
              user: true
            }
          }
        }
      });

      expect(result).toBeInstanceOf(ShoppingList);
      expect(result?.id).toBe(listData.id);
    });

    it("should return null if list not found", async () => {
      (prisma.shoppingList.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("findByUserId", () => {
    it("should find all lists for a user including collaborations", async () => {
      const listData = shoppingListFixture();
      (prisma.shoppingList.findMany as jest.Mock).mockResolvedValue([listData]);

      const result = await repository.findByUserId("user-123");

      expect(prisma.shoppingList.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { userId: "user-123" },
            {
              collaborators: {
                some: {
                  userId: "user-123"
                }
              }
            }
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

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ShoppingList);
    });
  });

  /*
  // These tests have been moved to PrismaShoppingListItemRepository.spec.ts
  // as the methods were refactored to specialized repositories
  describe("addItem", () => {
    it("should add an item to a list", async () => {
      const itemData = itemFixture();
      (prisma.shoppingListItem.create as jest.Mock).mockResolvedValue(itemData);

      const item = ShoppingListItemEntity.create({
        shoppingListId: itemData.shoppingListId,
        customName: itemData.customName,
        quantity: itemData.quantity,
        unit: itemData.unit,
        isCompleted: itemData.isCompleted,
        price: itemData.price,
        productId: undefined
      });

      const result = await repository.addItem(itemData.shoppingListId, item);

      expect(prisma.shoppingListItem.create).toHaveBeenCalledWith({
        data: {
          shoppingListId: itemData.shoppingListId,
          customName: itemData.customName,
          quantity: itemData.quantity,
          unit: itemData.unit,
          isCompleted: itemData.isCompleted,
          price: itemData.price
        }
      });

      expect(result).toBeInstanceOf(ShoppingListItemEntity);
      expect(result.customName).toBe(itemData.customName);
    });
  });

  describe("updateItem", () => {
    it("should update an item", async () => {
      const itemData = itemFixture();
      (prisma.shoppingListItem.update as jest.Mock).mockResolvedValue({
        ...itemData,
        isCompleted: true
      });

      const item = ShoppingListItemEntity.create(
        {
          ...itemData,
          isCompleted: true
        },
        itemData.id
      );

      const result = await repository.updateItem(item);

      expect(prisma.shoppingListItem.update).toHaveBeenCalledWith({
        where: { id: itemData.id },
        data: {
          customName: itemData.customName,
          quantity: itemData.quantity,
          unit: itemData.unit,
          isCompleted: true,
          price: itemData.price,
          updatedAt: new Date()
        }
      });

      expect(result).toBeInstanceOf(ShoppingListItemEntity);
      expect(result.isCompleted).toBe(true);
    });
  });

  describe("removeItem", () => {
    it("should remove an item", async () => {
      (prisma.shoppingListItem.delete as jest.Mock).mockResolvedValue({});

      await repository.removeItem("item-123");

      expect(prisma.shoppingListItem.delete).toHaveBeenCalledWith({
        where: { id: "item-123" }
      });
    });
  });
  */
});
