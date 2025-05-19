import type { CollaboratorRole } from "~/applications/ShoppingLists/Domain/Entities/ShoppingListCollaborator.entity";
import type { ShoppingListRepository } from "~/applications/ShoppingLists/Domain/Repositories/ShoppingListRepository";

export class ShareListUseCase {
  constructor(private shoppingListRepository: ShoppingListRepository) {}

  async execute(listId: string, email: string, role: CollaboratorRole): Promise<void> {
    const list = await this.shoppingListRepository.findById(listId);
    if (!list) throw new Error("Shopping list not found");

    // Find user by email first
    const user = await this.shoppingListRepository.findUserByEmail(email);
    if (!user) throw new Error("User not found");

    // Check if the user is already a collaborator
    const collaborators = await this.shoppingListRepository.getCollaborators(listId);
    const existingCollaborator = collaborators.find((c) => c.userId === user.id);

    if (existingCollaborator) {
      await this.shoppingListRepository.updateCollaboratorRole(listId, user.id, role);
    } else {
      await this.shoppingListRepository.addCollaborator(listId, email, role);
    }
  }
}
