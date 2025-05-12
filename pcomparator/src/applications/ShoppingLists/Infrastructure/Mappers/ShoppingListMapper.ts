import { ShoppingList } from "../../Domain/Entities/ShoppingList.entity";
import { ShoppingListItemEntity } from "../../Domain/Entities/ShoppingListItem.entity";

export class ShoppingListMapper {
  static toDomain(raw: any): ShoppingList {
    const itemEntities =
      raw.items?.map((item: any) =>
        ShoppingListItemEntity.create(
          {
            shoppingListId: raw.id,
            productId: item.productId,
            quantity: item.quantity,
            unit: item.unit,
            isCompleted: item.isCompleted,
            customName: item.customName,
            price: item.price,
            notes: item.notes
          },
          item.id
        )
      ) || [];

    return ShoppingList.create(
      {
        name: raw.name,
        description: raw.description,
        userId: raw.userId,
        items: itemEntities
      },
      raw.id
    );
  }

  static toPersistence(entity: ShoppingList): any {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: new Date()
    };
  }
}
