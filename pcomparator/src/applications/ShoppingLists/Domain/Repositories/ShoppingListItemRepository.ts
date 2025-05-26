import type { ShoppingListItem } from "~/ShoppingLists/Domain/Entities/ShoppingListItem.entity";

/**
 * Repository interface pour la gestion des articles de listes de courses
 */
export interface ShoppingListItemRepository {
  /**
   * Ajoute un article à une liste de courses
   */
  addItem(listId: string, item: ShoppingListItem): Promise<ShoppingListItem>;

  /**
   * Met à jour un article de liste de courses
   */
  updateItem(item: ShoppingListItem): Promise<ShoppingListItem>;

  /**
   * Supprime un article d'une liste de courses
   */
  removeItem(itemId: string): Promise<void>;

  /**
   * Récupère un article par son ID
   */
  findItemById(id: string): Promise<ShoppingListItem | null>;

  /**
   * Crée un produit à partir d'un article de liste de courses
   */
  createProductFromItem(productInfo: {
    name: string;
    price: number;
    unit: string;
    quantity: number;
    brandName: string;
    storeName: string;
    storeLocation: string;
    referencePrice: number;
    referenceUnit: string;
  }): Promise<any>;
}
