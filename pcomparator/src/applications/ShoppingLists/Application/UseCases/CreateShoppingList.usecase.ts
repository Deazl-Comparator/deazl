import { ShoppingList } from "../../Domain/Entities/ShoppingList.entity";
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

    return savedList;
  }
}
