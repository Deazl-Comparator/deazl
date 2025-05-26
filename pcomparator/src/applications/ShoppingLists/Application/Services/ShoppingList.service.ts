import { ShoppingList } from "~/ShoppingLists/Domain/Entities/ShoppingList.entity";
import { ShoppingListItem } from "~/ShoppingLists/Domain/Entities/ShoppingListItem.entity";
import type { ShoppingListRepository } from "~/ShoppingLists/Domain/Repositories/ShoppingListRepository";
import { ShoppingListDomainService } from "~/ShoppingLists/Domain/Services/ShoppingListDomainService";
import { auth } from "~/libraries/nextauth/authConfig";

/**
 * Service d'application qui orchestre les opérations sur les listes de courses
 * Il coordonne entre le domaine, l'infrastructure et les préoccupations transversales
 */
export class ShoppingListApplicationService {
  private readonly domainService: ShoppingListDomainService;

  constructor(private readonly repository: ShoppingListRepository) {
    this.domainService = new ShoppingListDomainService();
  }

  /**
   * Récupère toutes les listes de courses d'un utilisateur
   */
  async listUserShoppingLists(): Promise<ShoppingListItem[]> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const lists = await this.repository.findByUserId(session.user.id);

      // @ts-ignore
      return lists.map((list) => {
        const userRole = this.domainService.getUserRoleForList(list, session.user.id);
        return Object.assign(list, { userRole });
      });
    } catch (error) {
      console.error("Error listing user shopping lists", error);
      throw new Error("Failed to retrieve shopping lists");
    }
  }

  /**
   * Récupère une liste de courses par son ID
   */
  async getShoppingList(id: string): Promise<ShoppingList | null> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const list = await this.repository.findById(id);
      if (!list) return null;

      // Vérifier les permissions de lecture
      const userRole = this.domainService.getUserRoleForList(list, session.user.id);
      if (!this.domainService.canUserViewList(list, session.user.id, userRole || undefined)) {
        throw new Error("Unauthorized - insufficient permissions to view list");
      }

      return Object.assign(list, { userRole });
    } catch (error) {
      console.error("Error retrieving shopping list", error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle liste de courses
   */
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
  }): Promise<ShoppingList> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      // Validation métier
      const validation = this.domainService.validateListCreation(data);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }

      // Validation des articles si fournis
      if (data.items) {
        for (const item of data.items) {
          const itemValidation = this.domainService.validateNewItem(item);
          if (!itemValidation.isValid) {
            throw new Error(`Item validation failed: ${itemValidation.errors.join(", ")}`);
          }
        }
      }

      // Create ShoppingListItemEntity instances if items are provided
      const itemEntities =
        data.items?.map((item) =>
          ShoppingListItem.create({
            shoppingListId: "", // Will be set by the repository after shopping list creation
            quantity: item.quantity,
            unit: item.unit,
            isCompleted: item.isCompleted || false,
            customName: item.customName || undefined,
            price: item.price || undefined
          })
        ) || [];

      // Create the ShoppingList entity
      const shoppingList = ShoppingList.create({
        name: data.name,
        description: data.description || undefined,
        userId: session.user.id,
        items: itemEntities,
        isPublic: false // Default to private
      });

      return this.repository.create(shoppingList);
    } catch (error) {
      console.error("Error creating shopping list", error);
      throw error;
    }
  }

  /**
   * Supprime une liste de courses
   */
  async deleteShoppingList(id: string): Promise<void> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const list = await this.repository.findById(id);
      if (!list) throw new Error("Shopping list not found");

      // Seul le propriétaire peut supprimer
      if (list.userId !== session.user.id) {
        throw new Error("Unauthorized - only owner can delete list");
      }

      await this.repository.delete(id);
    } catch (error) {
      console.error("Error deleting shopping list", error);
      throw error;
    }
  }

  /**
   * Met à jour une liste de courses
   */
  async updateShoppingList(
    id: string,
    data: Partial<{ name: string; description: string }>
  ): Promise<ShoppingList> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const list = await this.repository.findById(id);
      if (!list) throw new Error("Shopping list not found");

      // Vérifier les permissions de modification
      const userRole = this.domainService.getUserRoleForList(list, session.user.id);
      if (!this.domainService.canUserModifyList(list, session.user.id, userRole || undefined)) {
        throw new Error("Unauthorized - insufficient permissions to modify list");
      }

      // Validation métier si on modifie le nom
      if (data.name !== undefined) {
        const validation = this.domainService.validateListCreation({
          name: data.name,
          description: data.description
        });
        if (!validation.isValid) {
          throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
        }
      }

      // Update the list entity
      if (data.name !== undefined) {
        list.updateName(data.name);
      }
      if (data.description !== undefined) {
        list.updateDescription(data.description);
      }

      return this.repository.update(list);
    } catch (error) {
      console.error("Error updating shopping list", error);
      throw error;
    }
  }

  /**
   * Vérifie l'authentification de l'utilisateur
   */
  private async isUserAuthenticated(): Promise<boolean> {
    const session = await auth();
    return !!session?.user?.id;
  }
}
