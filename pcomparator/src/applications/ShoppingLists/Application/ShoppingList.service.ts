import { auth } from "~/libraries/nextauth/authConfig";
import type { ShoppingList as ShoppingListEntity } from "../Domain/Entities/ShoppingList.entity";
import type { CollaboratorRole } from "../Domain/Entities/ShoppingListCollaborator.entity";
import type {
  ShoppingListItemEntity,
  ShoppingListItemPayload
} from "../Domain/Entities/ShoppingListItem.entity";
import type { ShoppingListRepository } from "../Domain/Repositories/ShoppingListRepository";
import { AddItemToListUseCase } from "./UseCases/AddItemToList.usecase";
import { CreateShoppingListUseCase } from "./UseCases/CreateShoppingList.usecase";

interface AddItemParams {
  customName?: string | null;
  productId?: string | null;
  quantity: number;
  unit: string;
  isCompleted?: boolean;
  price?: number | null;
  notes?: string | null;
}

export class ShoppingListService {
  private readonly createShoppingListUseCase: CreateShoppingListUseCase;
  private readonly addItemToListUseCase: AddItemToListUseCase;

  constructor(private shoppingListRepository: ShoppingListRepository) {
    this.createShoppingListUseCase = new CreateShoppingListUseCase(shoppingListRepository);
    this.addItemToListUseCase = new AddItemToListUseCase(shoppingListRepository);
  }

  private getUserRole(list: ShoppingListEntity, session: any): "OWNER" | "EDITOR" | "VIEWER" | undefined {
    if (!session?.user?.id) return undefined;

    // Check if user is owner
    if (list.userId === session.user.id) return "OWNER";

    // Check if user is a collaborator
    const collaborator = list.collaborators?.find((c) => c.userId === session.user.id);
    if (collaborator) return collaborator.role;

    return undefined;
  }

  async listUserShoppingLists(): Promise<ShoppingListEntity[]> {
    try {
      const session = await auth();

      if (!session?.user?.id) throw new Error("User not authenticated");

      const lists = await this.shoppingListRepository.findByUserId(session.user.id);

      return lists.map((list) => {
        const userRole = this.getUserRole(list, session)!;
        return Object.assign(list, { userRole });
      });
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

      // If it's a public list, allow access
      if (list.isPublic) {
        return list;
      }

      // Check if user is owner or collaborator
      if (list.userId !== session.user.id) {
        const collaborators = await this.shoppingListRepository.getCollaborators(id);
        if (!collaborators.some((c) => c.userId === session.user.id)) {
          throw new Error("Unauthorized access to shopping list");
        }
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
      // Propagate the original error message
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to create shopping list");
    }
  }

  async addItemToList(listId: string, itemData: AddItemParams): Promise<ShoppingListItemEntity> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const list = await this.shoppingListRepository.findById(listId);
      if (!list) throw new Error("Shopping list not found");

      // Check access rights - public lists can only be modified by owner or collaborators
      if (list.userId !== session.user.id) {
        const collaborators = await this.shoppingListRepository.getCollaborators(listId);
        const userRole = collaborators.find((c) => c.userId === session.user.id)?.role;

        // If the user is not a collaborator or is just a viewer, deny access
        if (!userRole || userRole === "VIEWER") {
          throw new Error("Unauthorized - insufficient permissions to modify list");
        }
      }

      return this.addItemToListUseCase.execute({
        listId,
        ...itemData
      });
    } catch (error) {
      console.error("Error adding item to list:", error);
      throw error;
    }
  }

  async updateShoppingListItem(
    itemId: string,
    data: Partial<Pick<ShoppingListItemPayload, "customName" | "quantity" | "unit" | "price" | "isCompleted">>
  ): Promise<ShoppingListItemEntity> {
    try {
      const session = await auth();
      if (!this.isUserAuthenticated()) throw new Error("User not authenticated");

      const item = await this.shoppingListRepository.findItemById(itemId);

      if (!item) throw new Error("Item not found");

      const list = await this.shoppingListRepository.findById(item.shoppingListId);

      if (!list) throw new Error("Shopping list not found");

      // This is an Entity rule
      if (list.userId !== session!.user.id) {
        const collaborators = await this.shoppingListRepository.getCollaborators(list.id);
        const userRole = collaborators.find((c) => c.userId === session!.user.id)?.role;
        if (!userRole || userRole === "VIEWER") {
          throw new Error("You need edit rights to modify this list");
        }
      }

      const updatedItem = item.withUpdates(data, item.id);

      return this.shoppingListRepository.updateItem(updatedItem);
    } catch (error) {
      console.error("Error updating shopping list item", error);
      // Propagate specific error messages
      if (error instanceof Error) {
        throw error; // This preserves the original error message
      }
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
      if (error instanceof Error) {
        throw error; // Preserve the original error message
      }
      throw new Error("Failed to delete shopping list");
    }
  }

  async removeShoppingListItem(itemId: string): Promise<void> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      // Get the item and its list to verify permissions
      const item = await this.shoppingListRepository.findItemById(itemId);
      if (!item) throw new Error("Item not found");

      const list = await this.shoppingListRepository.findById(item.shoppingListId);
      if (!list) throw new Error("Shopping list not found");

      // Check access rights - only owner and collaborators with edit rights can remove items
      if (list.userId !== session.user.id) {
        const collaborators = await this.shoppingListRepository.getCollaborators(list.id);
        const userRole = collaborators.find((c) => c.userId === session.user.id)?.role;

        // If the user is not a collaborator or is just a viewer, deny access
        if (!userRole || userRole === "VIEWER") {
          throw new Error("Unauthorized - insufficient permissions to modify list");
        }
      }

      await this.shoppingListRepository.removeItem(itemId);
    } catch (error) {
      console.error("Error removing item:", error);
      throw error;
    }
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
  }): Promise<any> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      return this.shoppingListRepository.createProductFromItem(productInfo);
    } catch (error) {
      console.error("Error creating product from item:", error);
      throw new Error("Failed to create product from item");
    }
  }

  async shareList(listId: string, email: string, role: CollaboratorRole): Promise<void> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      // Verify ownership
      const list = await this.shoppingListRepository.findById(listId);
      if (!list) throw new Error("Shopping list not found");

      if (list.userId !== session.user.id) {
        throw new Error("Only the owner can share the list");
      }

      // Find user by email
      const user = await this.shoppingListRepository.findUserByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }

      // Check if user is already a collaborator
      const collaborators = await this.shoppingListRepository.getCollaborators(listId);
      if (collaborators.some((c) => c.userId === user.id)) {
        throw new Error("User is already a collaborator");
      }

      await this.shoppingListRepository.addCollaborator(listId, email, role);
    } catch (error) {
      console.error("Error sharing list:", error);
      throw error;
    }
  }

  async getListCollaborators(listId: string) {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const list = await this.shoppingListRepository.findById(listId);
      if (!list) throw new Error("Shopping list not found");

      // Anyone can view collaborators of a public list
      if (list.isPublic) {
        return this.shoppingListRepository.getCollaborators(listId);
      }

      // For private lists, verify user has access
      if (list.userId !== session.user.id) {
        const collaborators = await this.shoppingListRepository.getCollaborators(listId);
        if (!collaborators.some((c) => c.userId === session.user.id)) {
          throw new Error("Access denied");
        }
      }

      return this.shoppingListRepository.getCollaborators(listId);
    } catch (error) {
      console.error("Error getting list collaborators:", error);
      throw error;
    }
  }

  async removeCollaborator(listId: string, userId: string): Promise<void> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const list = await this.shoppingListRepository.findById(listId);
      if (!list) throw new Error("Shopping list not found");

      // Verify ownership
      if (list.userId !== session.user.id) {
        throw new Error("Only the owner can remove collaborators");
      }

      // Check if user is a collaborator
      const collaborators = await this.shoppingListRepository.getCollaborators(listId);
      if (!collaborators.some((c) => c.userId === userId)) {
        throw new Error("User is not a collaborator");
      }

      await this.shoppingListRepository.removeCollaborator(listId, userId);
    } catch (error) {
      console.error("Error removing collaborator:", error);
      throw error;
    }
  }

  async generateShareToken(listId: string): Promise<string> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const list = await this.shoppingListRepository.findById(listId);
      if (!list) throw new Error("Shopping list not found");

      if (list.userId !== session.user.id) throw new Error("Only the owner can generate share tokens");

      return this.shoppingListRepository.generateShareToken(listId);
    } catch (error) {
      console.error("Error generating share token:", error);
      throw new Error("Failed to generate share token");
    }
  }

  async updatePublicStatus(listId: string, isPublic: boolean): Promise<void> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const list = await this.shoppingListRepository.findById(listId);
      if (!list) throw new Error("Shopping list not found");

      if (list.userId !== session.user.id) {
        throw new Error("Only the owner can change public status");
      }

      await this.shoppingListRepository.updatePublicStatus(listId, isPublic);
    } catch (error) {
      console.error("Error updating public status:", error);
      throw new Error("Failed to update public status");
    }
  }

  async getSharedList(token: string): Promise<ShoppingListEntity | null> {
    try {
      const list = await this.shoppingListRepository.getByShareToken(token);
      if (!list) throw new Error("Shared list not found");

      return list;
    } catch (error) {
      console.error("Error getting shared list:", error);
      throw error;
    }
  }

  async addCollaborator(listId: string, email: string, role: CollaboratorRole) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Not authenticated");

    return this.shoppingListRepository.addCollaborator(listId, email, role);
  }

  async isUserAuthenticated() {
    const session = await auth();
    return !!session?.user?.id;
  }
}
