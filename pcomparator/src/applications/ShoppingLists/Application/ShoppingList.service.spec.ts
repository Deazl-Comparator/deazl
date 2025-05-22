import { auth } from "~/libraries/nextauth/authConfig";
import { ShoppingList } from "../Domain/Entities/ShoppingList.entity";
import {
  CollaboratorRole,
  ShoppingListCollaborator
} from "../Domain/Entities/ShoppingListCollaborator.entity";
import { ShoppingListItemEntity } from "../Domain/Entities/ShoppingListItem.entity";
import type { ShoppingListRepository } from "../Domain/Repositories/ShoppingListRepository";
import { ShoppingListService } from "./ShoppingList.service";

jest.mock("~/libraries/nextauth/authConfig", () => ({
  auth: jest.fn()
}));

// Mock implementation of ShoppingListRepository
const mockRepository: jest.Mocked<ShoppingListRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findByUserId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  addItem: jest.fn(),
  updateItem: jest.fn(),
  removeItem: jest.fn(),
  findItemById: jest.fn(),
  createProductFromItem: jest.fn(),
  updatePublicStatus: jest.fn(),
  generateShareToken: jest.fn(),
  getByShareToken: jest.fn(),
  findUserById: jest.fn(),
  findUserByEmail: jest.fn(),
  addCollaborator: jest.fn(),
  removeCollaborator: jest.fn(),
  updateCollaboratorRole: jest.fn(),
  getCollaborators: jest.fn()
};

const mockSession = {
  user: {
    id: "user-123",
    email: "test@example.com"
  }
};

describe("ShoppingListService", () => {
  const service = new ShoppingListService(mockRepository);

  beforeEach(() => {
    (auth as jest.Mock).mockResolvedValue(mockSession);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createShoppingList", () => {
    it("should create a new shopping list", async () => {
      const listData = {
        name: "Test List",
        description: "Test description",
        items: [
          {
            customName: "Test Item",
            quantity: 1,
            unit: "piece",
            isCompleted: false,
            price: 10.99
          }
        ]
      };

      mockRepository.findUserById.mockResolvedValue({
        id: mockSession.user.id,
        email: mockSession.user.email
      });

      const mockCreatedList = ShoppingList.create({
        name: listData.name,
        description: listData.description,
        userId: mockSession.user.id,
        items: []
      });

      mockRepository.create.mockResolvedValue(mockCreatedList);

      const result = await service.createShoppingList(listData);

      expect(mockRepository.create).toHaveBeenCalled();
      expect(result).toBeInstanceOf(ShoppingList);
      expect(result.name).toBe(listData.name);
    });
  });

  describe("addItemToList", () => {
    it("should add an item to a list", async () => {
      const itemData = {
        customName: "Test Item",
        quantity: 1,
        unit: "piece",
        isCompleted: false,
        price: 10.99
      };

      const mockCreatedItem = ShoppingListItemEntity.create({
        shoppingListId: "list-123",
        ...itemData
      });

      mockRepository.findById.mockResolvedValue(
        ShoppingList.create({
          name: "Test List",
          userId: mockSession.user.id,
          items: []
        })
      );

      mockRepository.addItem.mockResolvedValue(mockCreatedItem);

      const result = await service.addItemToList("list-123", itemData);

      expect(mockRepository.findById).toHaveBeenCalledWith("list-123");
      expect(mockRepository.addItem).toHaveBeenCalled();
      expect(result).toBeInstanceOf(ShoppingListItemEntity);
    });

    it("should throw error if list not found", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.addItemToList("list-123", {
          customName: "Test Item",
          quantity: 1,
          unit: "piece"
        })
      ).rejects.toThrow("Shopping list not found");
    });
  });

  describe("updateShoppingListItem", () => {
    it("should update a list item when user has rights", async () => {
      const updateData = {
        customName: "Updated Item",
        isCompleted: true
      };

      const mockItem = ShoppingListItemEntity.create({
        shoppingListId: "list-123",
        customName: "Original Item",
        quantity: 1,
        unit: "piece"
      });

      const mockList = ShoppingList.create({
        name: "Test List",
        userId: mockSession.user.id, // Same as logged in user
        items: []
      });

      const mockUpdatedItem = ShoppingListItemEntity.create({
        shoppingListId: "list-123",
        customName: updateData.customName,
        quantity: 1,
        unit: "piece",
        isCompleted: true
      });

      mockRepository.findItemById.mockResolvedValue(mockItem);
      mockRepository.findById.mockResolvedValue(mockList);
      mockRepository.updateItem.mockResolvedValue(mockUpdatedItem);

      const result = await service.updateShoppingListItem("item-123", updateData);

      expect(mockRepository.findItemById).toHaveBeenCalledWith("item-123");
      expect(mockRepository.findById).toHaveBeenCalledWith("list-123");
      expect(mockRepository.updateItem).toHaveBeenCalled();
      expect(result).toBeInstanceOf(ShoppingListItemEntity);
      expect(result.customName).toBe(updateData.customName);
      expect(result.isCompleted).toBe(updateData.isCompleted);
    });

    it("should verify permissions before updating an item", async () => {
      const updateData = {
        customName: "Updated Item",
        isCompleted: true
      };

      const mockItem = ShoppingListItemEntity.create({
        shoppingListId: "list-123",
        customName: "Original Item",
        quantity: 1,
        unit: "piece"
      });

      const mockList = ShoppingList.create(
        {
          name: "Test List",
          userId: "different-user", // Different from mockSession.user.id
          items: []
        },
        mockItem.shoppingListId
      );

      mockRepository.findItemById.mockResolvedValue(mockItem);
      mockRepository.findById.mockResolvedValue(mockList);
      mockRepository.getCollaborators.mockResolvedValue([]);

      await expect(service.updateShoppingListItem("item-123", updateData)).rejects.toThrow(
        "You need edit rights to modify this list"
      );

      expect(mockRepository.findItemById).toHaveBeenCalledWith("item-123");
      expect(mockRepository.findById).toHaveBeenCalledWith("list-123");
      expect(mockRepository.getCollaborators).toHaveBeenCalledWith("list-123");
    });

    it("should throw error if item does not exist", async () => {
      mockRepository.findItemById.mockResolvedValue(null);

      await expect(
        service.updateShoppingListItem("item-123", { customName: "Updated Item" })
      ).rejects.toThrow("Item not found");

      expect(mockRepository.findItemById).toHaveBeenCalledWith("item-123");
    });

    it("should throw error if shopping list does not exist", async () => {
      const mockItem = ShoppingListItemEntity.create({
        shoppingListId: "list-123",
        customName: "Original Item",
        quantity: 1,
        unit: "piece"
      });

      mockRepository.findItemById.mockResolvedValue(mockItem);
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateShoppingListItem("item-123", { customName: "Updated Item" })
      ).rejects.toThrow("Shopping list not found");

      expect(mockRepository.findItemById).toHaveBeenCalledWith("item-123");
      expect(mockRepository.findById).toHaveBeenCalledWith("list-123");
    });

    it("should allow collaborator with edit rights to update item", async () => {
      const updateData = {
        customName: "Updated Item",
        isCompleted: true
      };

      const mockItem = ShoppingListItemEntity.create({
        shoppingListId: "list-123",
        customName: "Original Item",
        quantity: 1,
        unit: "piece"
      });

      const mockList = ShoppingList.create(
        {
          name: "Test List",
          userId: "different-user", // Different from mockSession.user.id
          items: []
        },
        mockItem.shoppingListId
      );

      const mockCollaborators = [
        ShoppingListCollaborator.create({
          listId: "list-123",
          userId: mockSession.user.id,
          role: CollaboratorRole.EDITOR
        })
      ];

      mockRepository.findItemById.mockResolvedValue(mockItem);
      mockRepository.findById.mockResolvedValue(mockList);
      mockRepository.getCollaborators.mockResolvedValue(mockCollaborators);

      const mockUpdatedItem = ShoppingListItemEntity.create({
        shoppingListId: mockItem.shoppingListId,
        customName: updateData.customName,
        quantity: mockItem.quantity,
        unit: mockItem.unit,
        isCompleted: updateData.isCompleted
      });
      mockRepository.updateItem.mockResolvedValue(mockUpdatedItem);

      const result = await service.updateShoppingListItem("item-123", updateData);

      expect(mockRepository.findItemById).toHaveBeenCalledWith("item-123");
      expect(mockRepository.findById).toHaveBeenCalledWith("list-123");
      expect(mockRepository.getCollaborators).toHaveBeenCalledWith("list-123");
      expect(mockRepository.updateItem).toHaveBeenCalled();
      expect(result.customName).toBe(updateData.customName);
    });
  });

  describe("removeShoppingListItem", () => {
    it("should remove a list item", async () => {
      const mockItem = ShoppingListItemEntity.create({
        shoppingListId: "list-123",
        customName: "Original Item",
        quantity: 1,
        unit: "piece"
      });

      const mockList = ShoppingList.create({
        name: "Test List",
        userId: mockSession.user.id,
        items: []
      });

      mockRepository.findItemById.mockResolvedValue(mockItem);
      mockRepository.findById.mockResolvedValue(mockList);
      mockRepository.removeItem.mockResolvedValue(undefined);

      await service.removeShoppingListItem("item-123");

      expect(mockRepository.findItemById).toHaveBeenCalledWith("item-123");
      expect(mockRepository.findById).toHaveBeenCalledWith("list-123");
      expect(mockRepository.removeItem).toHaveBeenCalledWith("item-123");
    });

    it("should throw error if item not found", async () => {
      mockRepository.findItemById.mockResolvedValue(null);

      await expect(service.removeShoppingListItem("item-123")).rejects.toThrow("Item not found");

      expect(mockRepository.findItemById).toHaveBeenCalledWith("item-123");
      expect(mockRepository.removeItem).not.toHaveBeenCalled();
    });
  });

  describe("deleteShoppingList", () => {
    it("should delete a shopping list", async () => {
      const mockList = ShoppingList.create(
        {
          name: "Test List",
          description: "Test description",
          userId: mockSession.user.id,
          items: []
        },
        "list-123"
      );
      mockRepository.findById.mockResolvedValue(mockList);
      mockRepository.delete.mockResolvedValue(undefined);

      await service.deleteShoppingList(mockList.id);

      expect(mockRepository.findById).toHaveBeenCalledWith(mockList.id);
      expect(mockRepository.delete).toHaveBeenCalledWith(mockList.id);
    });

    it("should throw error if shopping list not found", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.deleteShoppingList("list-123")).rejects.toThrow("Shopping list not found");

      expect(mockRepository.findById).toHaveBeenCalledWith("list-123");
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });
});
