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
}
