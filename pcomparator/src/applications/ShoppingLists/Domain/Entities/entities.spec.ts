import { ShoppingList } from "~/ShoppingLists/Domain/Entities/ShoppingList.entity";
import {
  CollaboratorRole,
  ShoppingListCollaborator
} from "~/ShoppingLists/Domain/Entities/ShoppingListCollaborator.entity";
import { ShoppingListItem } from "~/ShoppingLists/Domain/Entities/ShoppingListItem.entity";

describe("ShoppingList", () => {
  describe("create", () => {
    it("should create a valid shopping list", () => {
      const listData = {
        name: "Test List",
        description: "Test Description",
        userId: "user-123",
        items: []
      };

      const list = ShoppingList.create(listData);

      expect(list).toBeInstanceOf(ShoppingList);
      expect(list.name).toBe(listData.name);
      expect(list.description).toBe(listData.description);
      expect(list.userId).toBe(listData.userId);
      expect(list.items).toHaveLength(0);
    });

    it("should create a list with items", () => {
      const itemData = {
        shoppingListId: "list-123",
        customName: "Test Item",
        quantity: 1,
        unit: "piece",
        isCompleted: false
      };

      const item = ShoppingListItem.create(itemData);

      const list = ShoppingList.create({
        name: "Test List",
        userId: "user-123",
        items: [item]
      });

      expect(list.items).toHaveLength(1);
      expect(list.items[0]).toBeInstanceOf(ShoppingListItem);
    });
  });

  describe("addItem", () => {
    it("should add an item to the list", () => {
      const list = ShoppingList.create({
        name: "Test List",
        userId: "user-123",
        items: []
      });

      const item = ShoppingListItem.create({
        shoppingListId: list.id,
        customName: "Test Item",
        quantity: 1,
        unit: "piece"
      });

      list.addItem(item);

      expect(list.items).toHaveLength(1);
      expect(list.items[0]).toBe(item);
    });
  });

  describe("removeItem", () => {
    it("should remove an item from the list", () => {
      const item = ShoppingListItem.create({
        shoppingListId: "list-123",
        customName: "Test Item",
        quantity: 1,
        unit: "piece"
      });

      const list = ShoppingList.create({
        name: "Test List",
        userId: "user-123",
        items: [item]
      });

      list.removeItem(item.id);

      expect(list.items).toHaveLength(0);
    });
  });
});

describe("ShoppingListItem", () => {
  describe("create", () => {
    it("should create a valid shopping list item", () => {
      const itemData = {
        shoppingListId: "list-123",
        customName: "Test Item",
        quantity: 1,
        unit: "piece",
        isCompleted: false,
        price: 10.99,
        notes: "Test notes"
      };

      const item = ShoppingListItem.create(itemData);

      expect(item).toBeInstanceOf(ShoppingListItem);
      expect(item.customName).toBe(itemData.customName);
      expect(item.quantity).toBe(itemData.quantity);
      expect(item.unit).toBe(itemData.unit);
      expect(item.isCompleted).toBe(itemData.isCompleted);
      expect(item.price).toBe(itemData.price);
      expect(item.notes).toBe(itemData.notes);
    });
  });

  describe("toggleComplete", () => {
    it("should toggle completion status", () => {
      const item = ShoppingListItem.create({
        shoppingListId: "list-123",
        customName: "Test Item",
        quantity: 1,
        unit: "piece",
        isCompleted: false
      });

      item.toggleCompletion();
      expect(item.isCompleted).toBe(true);

      item.toggleCompletion();
      expect(item.isCompleted).toBe(false);
    });
  });

  describe("update", () => {
    it("should update item properties", () => {
      const item = ShoppingListItem.create({
        shoppingListId: "list-123",
        customName: "Test Item",
        quantity: 1,
        unit: "piece"
      });

      const updateData = {
        customName: "Updated Item",
        quantity: 2,
        price: 19.99
      };

      const newItem = item.withUpdates(updateData, item.shoppingListId);

      expect(newItem.customName).toBe(updateData.customName);
      expect(newItem.quantity).toBe(updateData.quantity);
      expect(newItem.price).toBe(updateData.price);
    });
  });
});

describe("ShoppingListCollaborator", () => {
  describe("create", () => {
    it("should create a valid collaborator", () => {
      const collaboratorData = {
        userId: "user-123",
        listId: "list-123",
        role: CollaboratorRole.EDITOR
      };

      const collaborator = ShoppingListCollaborator.create(collaboratorData);

      expect(collaborator).toBeInstanceOf(ShoppingListCollaborator);
      expect(collaborator.userId).toBe(collaboratorData.userId);
      expect(collaborator.listId).toBe(collaboratorData.listId);
      expect(collaborator.role).toBe(collaboratorData.role);
    });
  });

  describe("updateRole", () => {
    it("should update collaborator role", () => {
      const collaborator = ShoppingListCollaborator.create({
        userId: "user-123",
        listId: "list-123",
        role: "VIEWER" as CollaboratorRole
      });

      collaborator.updateRole(CollaboratorRole.EDITOR);

      expect(collaborator.role).toBe("EDITOR");
    });
  });
});
