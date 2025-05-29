import { ShoppingListItem } from "~/ShoppingLists/Domain/Entities/ShoppingListItem.entity";
import type { ShoppingListItemRepository } from "~/ShoppingLists/Domain/Repositories/ShoppingListItemRepository";
import type { ShoppingListRepository } from "~/ShoppingLists/Domain/Repositories/ShoppingListRepository";
import { UnitType } from "~/ShoppingLists/Domain/ValueObjects/Unit.vo";
import { auth } from "~/libraries/nextauth/authConfig";

/**
 * Service d'application pour la gestion des articles de listes de courses
 */
export class ShoppingListItemApplicationService {
  constructor(
    private readonly listRepository: ShoppingListRepository,
    private readonly itemRepository: ShoppingListItemRepository
  ) {}

  /**
   * Ajoute un article à une liste de courses
   */
  async addItemToList(
    listId: string,
    itemData: {
      customName?: string | null;
      productId?: string | null;
      quantity: number;
      unit: string;
      isCompleted?: boolean;
      price?: number | null;
      notes?: string | null;
      barcode?: string | null;
    }
  ): Promise<ShoppingListItem> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const list = await this.listRepository.findById(listId);
      if (!list) throw new Error("Shopping list not found");

      // Vérifier les permissions de modification
      const userRole = list.getUserRole(session.user.id);
      if (!list.canUserModify(session.user.id, userRole || undefined)) {
        throw new Error("Unauthorized - insufficient permissions to modify list");
      }

      // Note: La validation des données est maintenant effectuée au niveau API avec les Value Objects

      // Créer l'entité article
      const item = ShoppingListItem.create({
        shoppingListId: listId,
        customName: itemData.customName || undefined,
        productId: itemData.productId,
        quantity: itemData.quantity,
        unit: itemData.unit,
        isCompleted: itemData.isCompleted || false,
        price: itemData.price || undefined,
        notes: itemData.notes || undefined,
        barcode: itemData.barcode || undefined
      });

      return this.itemRepository.addItem(listId, item);
    } catch (error) {
      console.error("Error adding item to list", error);
      throw error;
    }
  }

  /**
   * Met à jour un article de liste de courses
   */
  async updateShoppingListItem(
    itemId: string,
    data: Partial<{
      customName: string | null;
      quantity: number;
      unit: string;
      price: number | null;
      isCompleted: boolean;
      barcode: string | null;
      notes: string | null;
    }>
  ): Promise<ShoppingListItem> {
    try {
      console.log("🔧 ShoppingListItemApplicationService.updateShoppingListItem called:", { itemId, data });
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const item = await this.itemRepository.findItemById(itemId);
      if (!item) throw new Error("Item not found");
      console.log("📦 Found item in service:", item);

      const list = await this.listRepository.findById(item.shoppingListId);
      if (!list) throw new Error("Shopping list not found");

      // Vérifier les permissions de modification
      const userRole = list.getUserRole(session.user.id);
      if (!list.canUserModify(session.user.id, userRole || undefined)) {
        throw new Error("Unauthorized - insufficient permissions to modify list");
      }

      // Create updated item using immutable methods
      let updatedItem = item;

      if (data.customName !== undefined) {
        updatedItem = updatedItem.withName(data.customName || "");
      }

      if (data.quantity !== undefined) {
        updatedItem = updatedItem.withQuantity(data.quantity);
      }

      if (data.unit !== undefined && Object.values(UnitType).includes(data.unit as UnitType)) {
        updatedItem = updatedItem.withUnit(data.unit);
      }

      if (data.price !== undefined) {
        updatedItem = updatedItem.withPrice(data.price);
      }

      if (data.isCompleted !== undefined) {
        console.log("🔄 Updating isCompleted field:", {
          previous: updatedItem.isCompleted,
          new: data.isCompleted
        });
        if (data.isCompleted) {
          updatedItem = updatedItem.withCompletion();
        } else {
          updatedItem = updatedItem.withReset();
        }
        console.log("✅ isCompleted field updated:", { current: updatedItem.isCompleted });
      }

      if (data.barcode !== undefined) {
        updatedItem = updatedItem.withBarcode(data.barcode);
      }

      console.log("🔄 Calling repository.updateItem with:", {
        id: updatedItem.id,
        isCompleted: updatedItem.isCompleted
      });
      const result = await this.itemRepository.updateItem(updatedItem);
      console.log("✅ Repository.updateItem completed:", {
        id: result.id,
        isCompleted: result.isCompleted
      });

      return result;
    } catch (error) {
      console.error("Error updating shopping list item", error);
      throw error;
    }
  }

  /**
   * Supprime un article d'une liste de courses
   */
  async removeShoppingListItem(itemId: string): Promise<void> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const item = await this.itemRepository.findItemById(itemId);
      if (!item) throw new Error("Item not found");

      const list = await this.listRepository.findById(item.shoppingListId);
      if (!list) throw new Error("Shopping list not found");

      // Vérifier les permissions de modification
      const userRole = list.getUserRole(session.user.id);
      if (!list.canUserModify(session.user.id, userRole || undefined)) {
        throw new Error("Unauthorized - insufficient permissions to modify list");
      }

      await this.itemRepository.removeItem(itemId);
    } catch (error) {
      console.error("Error removing shopping list item", error);
      throw error;
    }
  }

  /**
   * Bascule l'état de completion d'un article
   */
  async toggleItemCompletion(itemId: string): Promise<ShoppingListItem> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const item = await this.itemRepository.findItemById(itemId);
      if (!item) throw new Error("Item not found");

      const list = await this.listRepository.findById(item.shoppingListId);
      if (!list) throw new Error("Shopping list not found");

      // Vérifier les permissions de modification
      const userRole = list.getUserRole(session.user.id);
      if (!list.canUserModify(session.user.id, userRole || undefined)) {
        throw new Error("Unauthorized - insufficient permissions to modify list");
      }

      const updatedItem = item.withUpdates(
        {
          isCompleted: !item.isCompleted
        },
        item.id
      );

      return this.itemRepository.updateItem(updatedItem);
    } catch (error) {
      console.error("Error toggling item completion", error);
      throw error;
    }
  }
}
