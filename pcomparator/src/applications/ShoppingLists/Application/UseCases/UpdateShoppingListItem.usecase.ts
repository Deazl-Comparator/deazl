import type { ShoppingListItemEntity } from "../../Domain/Entities/ShoppingListItem.entity";
import type { ShoppingListRepository } from "../../Domain/Repositories/ShoppingListRepository";

interface UpdateShoppingListItemDTO {
  itemId: string;
  customName?: string | null;
  quantity?: number;
  unit?: string;
  isCompleted?: boolean;
  price?: number | null;
  notes?: string | null;
}

export class UpdateShoppingListItemUseCase {
  constructor(private shoppingListRepository: ShoppingListRepository) {}

  async execute(dto: UpdateShoppingListItemDTO): Promise<ShoppingListItemEntity> {
    // Fetch current item data
    const existingItem = await this.getExistingItem(dto.itemId);
    if (!existingItem) {
      throw new Error(`Item with id ${dto.itemId} not found`);
    }

    // Apply updates
    // @ts-ignore
    if (dto.customName !== undefined) existingItem.updateName(dto.customName);
    if (dto.quantity !== undefined) existingItem.updateQuantity(dto.quantity);
    if (dto.unit !== undefined) existingItem.updateUnit(dto.unit);
    if (dto.isCompleted !== undefined) {
      if (dto.isCompleted) {
        existingItem.complete();
      } else {
        existingItem.reset();
      }
    }
    if (dto.price !== undefined) existingItem.updatePrice(dto.price);
    if (dto.notes !== undefined) existingItem.updateNotes(dto.notes);

    // Save and return updated item
    return this.shoppingListRepository.updateItem(existingItem);
  }

  private async getExistingItem(itemId: string): Promise<ShoppingListItemEntity | null> {
    // This is a simplified approach. In a real app, you would have a dedicated repository method.
    // Here we're utilizing an assumption that we might have to load the shopping list first.
    // Implementation will depend on the actual repository capabilities.
    try {
      // Mocked implementation - in reality, you'd fetch the actual item
      // This should be replaced with a proper repository method
      const lists = await this.shoppingListRepository.findByUserId("any");
      for (const list of lists) {
        const item = list.getItemById(itemId);
        if (item) return item;
      }
      return null;
    } catch (error) {
      console.error("Error fetching item:", error);
      return null;
    }
  }
}
