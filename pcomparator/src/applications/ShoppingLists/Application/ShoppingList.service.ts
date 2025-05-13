import { CreateProductFromItemUseCase } from "~/applications/ShoppingLists/Application/UseCases/CreateProductFromItem.usecase";
import { auth } from "~/libraries/nextauth/authConfig";
import type { ShoppingList as ShoppingListEntity } from "../Domain/Entities/ShoppingList.entity";
import type { ShoppingListItemEntity } from "../Domain/Entities/ShoppingListItem.entity";
import type { ShoppingListRepository } from "../Domain/Repositories/ShoppingListRepository";
import type { ProductInformation } from "../Domain/ValueObjects/ProductInformation";
import { AddItemToListUseCase } from "./UseCases/AddItemToList.usecase";
import { CreateShoppingListUseCase } from "./UseCases/CreateShoppingList.usecase";
import { UpdateShoppingListItemUseCase } from "./UseCases/UpdateShoppingListItem.usecase";

export class ShoppingListService {
  private readonly createShoppingListUseCase: CreateShoppingListUseCase;
  private readonly addItemToListUseCase: AddItemToListUseCase;
  private readonly updateItemUseCase: UpdateShoppingListItemUseCase;
  private readonly createProductFromItemUseCase: CreateProductFromItemUseCase;

  constructor(private shoppingListRepository: ShoppingListRepository) {
    this.createShoppingListUseCase = new CreateShoppingListUseCase(shoppingListRepository);
    this.addItemToListUseCase = new AddItemToListUseCase(shoppingListRepository);
    this.updateItemUseCase = new UpdateShoppingListItemUseCase(shoppingListRepository);
    this.createProductFromItemUseCase = new CreateProductFromItemUseCase();
  }

  async listUserShoppingLists(): Promise<ShoppingListEntity[]> {
    try {
      const session = await auth();

      if (!session?.user?.id) throw new Error("User not authenticated");

      return this.shoppingListRepository.findByUserId(session.user.id);
    } catch (error) {
      console.error("Error listing user shopping lists", error);
      throw new Error("Failed to retrieve shopping lists");
    }
  }

  async getShoppingList(id: string): Promise<ShoppingListEntity | null> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const list = await this.shoppingListRepository.findById(id);
      if (!list) return null;

      // Verify ownership
      if (list.userId !== session.user.id) {
        throw new Error("Unauthorized access to shopping list");
      }

      return list;
    } catch (error) {
      console.error("Error retrieving shopping list", error);
      throw new Error("Failed to retrieve shopping list");
    }
  }

  async createShoppingList(data: {
    name: string;
    description?: string | null;
    items?: Array<{
      customName?: string | null;
      quantity: number;
      unit: string;
      isCompleted?: boolean;
      price?: number | null;
    }>;
  }): Promise<ShoppingListEntity> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      return this.createShoppingListUseCase.execute({
        ...data,
        userId: session.user.id
      });
    } catch (error) {
      console.error("Error creating shopping list", error);
      throw new Error("Failed to create shopping list");
    }
  }

  async addItemToList(
    listId: string,
    itemData: {
      customName?: string | null;
      quantity: number;
      unit: string;
      isCompleted?: boolean;
      price?: number | null;
    }
  ): Promise<ShoppingListItemEntity> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      // Verify ownership
      const list = await this.getShoppingList(listId);
      if (!list) throw new Error("Shopping list not found");

      return this.addItemToListUseCase.execute({
        listId,
        ...itemData
      });
    } catch (error) {
      console.error("Error adding item to list", error);
      throw new Error("Failed to add item to list");
    }
  }

  async updateShoppingListItem(
    itemId: string,
    data: {
      customName?: string | null;
      quantity?: number;
      unit?: string;
      isCompleted?: boolean;
      price?: number | null;
      notes?: string | null;
    }
  ): Promise<ShoppingListItemEntity> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      // In a real app, you'd also verify ownership of the item

      return this.updateItemUseCase.execute({
        itemId,
        ...data
      });
    } catch (error) {
      console.error("Error updating shopping list item", error);
      throw new Error("Failed to update shopping list item");
    }
  }

  async deleteShoppingList(id: string): Promise<void> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      // Verify ownership
      const list = await this.getShoppingList(id);
      if (!list) throw new Error("Shopping list not found");

      await this.shoppingListRepository.delete(id);
    } catch (error) {
      console.error("Error deleting shopping list", error);
      throw new Error("Failed to delete shopping list");
    }
  }

  async removeShoppingListItem(itemId: string): Promise<void> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      // In a real app, you'd also verify ownership of the item

      await this.shoppingListRepository.removeItem(itemId);
    } catch (error) {
      console.error("Error removing shopping list item", error);
      throw new Error("Failed to remove shopping list item");
    }
  }

  async createProductFromItem(productInfo: ProductInformation): Promise<any> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      return this.createProductFromItemUseCase.execute(productInfo);
    } catch (error) {
      console.error("Error creating product from item:", error);
      throw new Error("Failed to create product from item");
    }
  }
}
