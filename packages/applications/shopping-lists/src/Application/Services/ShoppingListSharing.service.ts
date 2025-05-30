import { AuthenticationService, DomainError } from "@deazl/shared";
import { auth } from "@deazl/system";
import type { GetCollaboratorsPayload } from "../../Api/shoppingLists/share/getCollaborators.api";
import type { CollaboratorRole } from "../../Domain/Entities/ShoppingListCollaborator.entity";
import type { ShoppingListRepository } from "../../Domain/Repositories/ShoppingListRepository";
import type { ShoppingListSharingRepository } from "../../Domain/Repositories/ShoppingListSharingRepository";
import { CollaboratorRoleValidator } from "../../Domain/ValueObjects/CollaboratorRoleValidator.vo";

/**
 * Service d'application pour la gestion du partage des listes de courses
 */
export class ShoppingListSharingApplicationService {
  private readonly authService: AuthenticationService;

  constructor(
    private readonly listRepository: ShoppingListRepository,
    private readonly sharingRepository: ShoppingListSharingRepository
  ) {
    this.authService = new AuthenticationService();
  }

  async shareList(listId: string, email: string, role: "OWNER" | "EDITOR" | "VIEWER"): Promise<void> {
    try {
      const user: any = await this.authService.getCurrentUser();

      const list = await this.listRepository.findById(listId);

      if (!list) throw new Error("Shopping list not found");

      if (!list.canUserShare(user.id)) throw new Error("Unauthorized - only owner can share list");

      if (!list.canBeShared()) throw new Error("List cannot be shared - list must have a name");

      if (!CollaboratorRoleValidator.isValid(role)) throw new Error("Invalid collaborator role");

      const collaborators = await this.sharingRepository.getCollaborators(listId);
      const existingCollaborator = collaborators.find((c: any) => c.userId === user.id);

      if (existingCollaborator)
        await this.sharingRepository.updateCollaboratorRole(listId, user.id, role as CollaboratorRole);
      else await this.sharingRepository.addCollaborator(listId, email, role as CollaboratorRole);
    } catch (error) {
      if (error instanceof DomainError) throw error;

      throw new Error("Error sharing list", { cause: error });
    }
  }

  async getListCollaborators(shoppingListId: GetCollaboratorsPayload) {
    try {
      const user: any = await this.authService.getCurrentUser();
      const list = await this.listRepository.findById(shoppingListId);

      if (!list) throw new Error("Shopping list not found");

      const userRole = list.getUserRole(user.id);

      if (!list.canUserView(user.id, userRole || undefined))
        throw new Error("Unauthorized - insufficient permissions to view collaborators");

      return this.sharingRepository.getCollaborators(shoppingListId);
    } catch (error) {
      if (error instanceof DomainError) throw error;

      throw new Error("Error retrieving collaborators", { cause: error });
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
      if (!list.canUserShare(session.user.id!)) {
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
      const session: any = await auth();
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
