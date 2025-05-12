import { ShoppingListItemEntity } from "../../Domain/Entities/ShoppingListItem.entity";
import type { ShoppingListRepository } from "../../Domain/Repositories/ShoppingListRepository";

interface AddItemToListDTO {
  listId: string;
  customName?: string | null;
  productId?: string | null;
  quantity: number;
  unit: string;
  isCompleted?: boolean;
  price?: number | null;
  notes?: string | null;
}

export class AddItemToListUseCase {
  constructor(private shoppingListRepository: ShoppingListRepository) {}

  async execute(dto: AddItemToListDTO): Promise<ShoppingListItemEntity> {
    const list = await this.shoppingListRepository.findById(dto.listId);
    if (!list) {
      throw new Error(`Shopping list with id ${dto.listId} not found`);
    }

    const item = ShoppingListItemEntity.create({
      shoppingListId: dto.listId,
      // @ts-ignore
      customName: dto.customName,
      productId: dto.productId,
      quantity: dto.quantity,
      unit: dto.unit,
      isCompleted: dto.isCompleted || false,
      price: dto.price,
      notes: dto.notes
    });

    return this.shoppingListRepository.addItem(dto.listId, item);
  }
}
