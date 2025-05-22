import { ShoppingList } from "../../Domain/Entities/ShoppingList.entity";
import { CollaboratorRole } from "../../Domain/Entities/ShoppingListCollaborator.entity";
import { ShoppingListItemEntity } from "../../Domain/Entities/ShoppingListItem.entity";
import type { ShoppingListRepository } from "../../Domain/Repositories/ShoppingListRepository";

interface CreateShoppingListDTO {
  name: string;
  description?: string | null;
  userId: string;
  items?: {
    customName?: string | null;
    quantity: number;
    unit: string;
    isCompleted?: boolean;
    price?: number | null;
    notes?: string | null;
  }[];
}

export class CreateShoppingListUseCase {
  constructor(private shoppingListRepository: ShoppingListRepository) {}

  async execute(dto: CreateShoppingListDTO): Promise<ShoppingList> {
    try {
      // Find user email for collaboration
      const user = await this.shoppingListRepository.findUserById(dto.userId);
      if (!user) {
        throw new Error("User not found");
      }

      const itemEntities =
        dto.items?.map((item) =>
          ShoppingListItemEntity.create({
            shoppingListId: "", // Temporary value that will be updated
            // @ts-ignore
            customName: item.customName,
            quantity: item.quantity,
            unit: item.unit,
            isCompleted: item.isCompleted || false,
            price: item.price,
            notes: item.notes
          })
        ) || [];

      const shoppingList = ShoppingList.create({
        name: dto.name,
        // @ts-ignore
        description: dto.description,
        userId: dto.userId,
        items: itemEntities
      });

      const savedList = await this.shoppingListRepository.create(shoppingList);

      // Add creator as OWNER collaborator
      try {
        await this.shoppingListRepository.addCollaborator(savedList.id, user.email, CollaboratorRole.OWNER);
      } catch (error) {
        // If collaborator already exists, we can ignore the error
        if (error instanceof Error && !error.message.includes("already a collaborator")) {
          throw error;
        }
        console.warn("Warning: Creator already a collaborator of list", savedList.id);
      }

      return savedList;
    } catch (error) {
      console.error("Error in CreateShoppingListUseCase:", error);
      throw error;
    }
  }
}
