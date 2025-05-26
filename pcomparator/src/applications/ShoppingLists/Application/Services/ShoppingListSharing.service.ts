import type { CollaboratorRole } from "~/ShoppingLists/Domain/Entities/ShoppingListCollaborator.entity";
import type { ShoppingListRepository } from "~/ShoppingLists/Domain/Repositories/ShoppingListRepository";
import type { ShoppingListSharingRepository } from "~/ShoppingLists/Domain/Repositories/ShoppingListSharingRepository";
import { ShoppingListDomainService } from "~/ShoppingLists/Domain/Services/ShoppingListDomainService";
import { auth } from "~/libraries/nextauth/authConfig";

/**
 * Service d'application pour la gestion du partage des listes de courses
 */
export class ShoppingListSharingApplicationService {
  private readonly domainService: ShoppingListDomainService;

  constructor(
    private readonly listRepository: ShoppingListRepository,
    private readonly sharingRepository: ShoppingListSharingRepository
  ) {
    this.domainService = new ShoppingListDomainService();
  }

  /**
   * Partage une liste avec un utilisateur
   */
  async shareList(listId: string, email: string, role: "OWNER" | "EDITOR" | "VIEWER"): Promise<void> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const list = await this.listRepository.findById(listId);
      if (!list) throw new Error("Shopping list not found");

      // Vérifier les permissions de partage
      if (!this.domainService.canUserShareList(list, session.user.id)) {
        throw new Error("Unauthorized - only owner can share list");
      }

      // Vérifier que la liste peut être partagée
      if (!this.domainService.canListBeShared(list)) {
        throw new Error("List cannot be shared - list must have a name");
      }

      // Valider le rôle
      if (!this.domainService.isValidCollaboratorRole(role)) {
        throw new Error("Invalid collaborator role");
      }

      // Vérifier que l'utilisateur existe
      const user = await this.sharingRepository.findUserByEmail(email);
      if (!user) throw new Error("User not found");

      // Vérifier si l'utilisateur est déjà collaborateur
      const collaborators = await this.sharingRepository.getCollaborators(listId);
      const existingCollaborator = collaborators.find((c: any) => c.userId === user.id);

      if (existingCollaborator) {
        // Mettre à jour le rôle existant
        await this.sharingRepository.updateCollaboratorRole(listId, user.id, role as CollaboratorRole);
      } else {
        // Ajouter un nouveau collaborateur
        await this.sharingRepository.addCollaborator(listId, email, role as CollaboratorRole);
      }
    } catch (error) {
      console.error("Error sharing list", error);
      throw error;
    }
  }

  /**
   * Récupère la liste des collaborateurs d'une liste
   */
  async getListCollaborators(listId: string) {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const list = await this.listRepository.findById(listId);
      if (!list) throw new Error("Shopping list not found");

      // Vérifier les permissions de lecture
      const userRole = this.domainService.getUserRoleForList(list, session.user.id);
      if (!this.domainService.canUserViewList(list, session.user.id!, userRole || undefined)) {
        throw new Error("Unauthorized - insufficient permissions to view collaborators");
      }

      return this.sharingRepository.getCollaborators(listId);
    } catch (error) {
      console.error("Error retrieving collaborators", error);
      throw error;
    }
  }

  /**
   * Supprime un collaborateur d'une liste
   */
  async removeCollaborator(listId: string, userId: string): Promise<void> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const list = await this.listRepository.findById(listId);
      if (!list) throw new Error("Shopping list not found");

      // Vérifier les permissions de partage
      if (!this.domainService.canUserShareList(list, session.user.id!)) {
        throw new Error("Unauthorized - only owner can remove collaborators");
      }

      // Empêcher le propriétaire de se supprimer lui-même
      if (userId === session.user.id) {
        throw new Error("Owner cannot remove themselves from the list");
      }

      await this.sharingRepository.removeCollaborator(listId, userId);
    } catch (error) {
      console.error("Error removing collaborator", error);
      throw error;
    }
  }

  /**
   * Quitte une liste partagée (pour un collaborateur)
   */
  async leaveSharedList(listId: string): Promise<void> {
    try {
      const session = await auth();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const list = await this.listRepository.findById(listId);
      if (!list) throw new Error("Shopping list not found");

      // Vérifier que l'utilisateur n'est pas le propriétaire
      if (list.userId === session.user.id) {
        throw new Error("Owner cannot leave their own list - delete the list instead");
      }

      // Vérifier que l'utilisateur est bien collaborateur
      const collaborators = await this.sharingRepository.getCollaborators(listId);
      const isCollaborator = collaborators.some((c: any) => c.userId === session.user.id);

      if (!isCollaborator) {
        throw new Error("You are not a collaborator of this list");
      }

      await this.sharingRepository.removeCollaborator(listId, session.user.id!);
    } catch (error) {
      console.error("Error leaving shared list", error);
      throw error;
    }
  }
}
