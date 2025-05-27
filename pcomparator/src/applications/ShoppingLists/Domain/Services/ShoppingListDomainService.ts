// Services de domaine pour les listes de courses
// Ces services encapsulent la logique métier pure

import type { ShoppingList } from "~/ShoppingLists/Domain/Entities/ShoppingList.entity";

/**
 * Service de domaine contenant la logique métier pure pour les listes de courses
 * Ce service ne dépend d'aucune infrastructure et contient uniquement de la logique métier
 */
export class ShoppingListDomainService {
  /**
   * Détermine si un utilisateur peut modifier une liste
   */
  canUserModifyList(list: ShoppingList, userId: string, userRole?: string): boolean {
    // Le propriétaire peut toujours modifier
    if (list.userId === userId) return true;

    // Les collaborateurs avec rôle EDITOR peuvent modifier
    if (userRole === "EDITOR") return true;

    // Les collaborateurs avec rôle VIEWER ne peuvent pas modifier
    return false;
  }

  /**
   * Détermine si un utilisateur peut voir une liste
   */
  canUserViewList(list: ShoppingList, userId: string, userRole?: string): boolean {
    // Le propriétaire peut toujours voir
    if (list.userId === userId) return true;

    // Tout collaborateur peut voir la liste
    if (userRole) return true;

    return false;
  }

  /**
   * Calcule les statistiques d'une liste
   */
  calculateListStatistics(list: ShoppingList): {
    totalItems: number;
    completedItems: number;
    completionPercentage: number;
    totalPrice: number;
    totalPendingPrice: number;
    totalCompletedPrice: number;
  } {
    const items = list.items || [];
    const totalItems = items.length;
    const completedItems = items.filter((item) => item.isCompleted).length;
    const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    const totalPrice = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    const totalCompletedPrice = items
      .filter((item) => item.isCompleted)
      .reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    const totalPendingPrice = totalPrice - totalCompletedPrice;

    return {
      totalItems,
      completedItems,
      completionPercentage,
      totalPrice,
      totalPendingPrice,
      totalCompletedPrice
    };
  }

  /**
   * Valide les données d'un nouvel article
   */
  validateNewItem(itemData: {
    customName?: string | null;
    productId?: string | null;
    quantity: number;
    unit: string;
    price?: number | null;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validation du nom personnalisé ou productId requis (au moins l'un des deux)
    if (!itemData.customName?.trim() && !itemData.productId?.trim()) {
      errors.push("Either item name or product ID is required");
    }

    // Validation de la quantité
    if (!itemData.quantity || itemData.quantity <= 0) {
      errors.push("Quantity must be greater than 0");
    }

    // Validation de l'unité
    if (!itemData.unit?.trim()) {
      errors.push("Unit is required");
    }

    // Validation du prix (optionnel mais doit être positif si fourni)
    if (itemData.price !== null && itemData.price !== undefined && itemData.price < 0) {
      errors.push("Price must be positive");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Détermine si une liste peut être partagée
   */
  canListBeShared(list: ShoppingList): boolean {
    // Une liste ne peut être partagée que si elle a un nom
    return !!list.name?.trim();
  }

  /**
   * Valide les données de création d'une liste
   */
  validateListCreation(data: {
    name: string;
    description?: string | null;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validation du nom
    if (!data.name?.trim()) {
      errors.push("List name is required");
    } else if (data.name.trim().length < 2) {
      errors.push("List name must be at least 2 characters long");
    } else if (data.name.trim().length > 100) {
      errors.push("List name must be less than 100 characters");
    }

    // Validation de la description (optionnelle)
    if (data.description && data.description.length > 500) {
      errors.push("Description must be less than 500 characters");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Détermine le rôle d'un utilisateur pour une liste donnée
   */
  getUserRoleForList(list: ShoppingList, userId: string): string | null {
    // Le propriétaire a le rôle OWNER
    if (list.userId === userId) return "OWNER";

    // Chercher parmi les collaborateurs
    const collaborator = list.collaborators?.find((c) => c.userId === userId);
    return collaborator?.role || null;
  }

  /**
   * Valide les permissions pour partager une liste
   */
  canUserShareList(list: ShoppingList, userId: string): boolean {
    // Seul le propriétaire peut partager la liste
    return list.userId === userId;
  }

  /**
   * Valide un rôle de collaborateur
   */
  isValidCollaboratorRole(role: string): boolean {
    return ["OWNER", "EDITOR", "VIEWER"].includes(role);
  }

  /**
   * Valide les données de mise à jour d'un article
   */
  validateItemUpdate(itemData: {
    customName?: string | null;
    quantity?: number;
    unit?: string;
    price?: number | null;
    isCompleted?: boolean;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validation du nom personnalisé si fourni
    if (itemData.customName !== undefined && !itemData.customName?.trim()) {
      errors.push("Item name cannot be empty");
    }

    // Validation de la quantité si fournie
    if (itemData.quantity !== undefined && itemData.quantity <= 0) {
      errors.push("Quantity must be greater than 0");
    }

    // Validation de l'unité si fournie
    if (itemData.unit !== undefined && !itemData.unit?.trim()) {
      errors.push("Unit cannot be empty");
    }

    // Validation du prix si fourni
    if (itemData.price !== null && itemData.price !== undefined && itemData.price < 0) {
      errors.push("Price must be positive");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
