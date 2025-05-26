import type { ShoppingList } from "../Entities/ShoppingList.entity";

/**
 * Repository interface pour la gestion des listes de courses
 */
export interface ShoppingListRepository {
  /**
   * Crée une nouvelle liste de courses
   */
  create(list: ShoppingList): Promise<ShoppingList>;

  /**
   * Récupère une liste de courses par son ID
   */
  findById(id: string): Promise<ShoppingList | null>;

  /**
   * Récupère toutes les listes de courses d'un utilisateur
   */
  findByUserId(userId: string): Promise<ShoppingList[]>;

  /**
   * Met à jour une liste de courses
   */
  update(list: ShoppingList): Promise<ShoppingList>;

  /**
   * Supprime une liste de courses
   */
  delete(id: string): Promise<void>;
}
