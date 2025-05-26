import { ShoppingList } from "~/ShoppingLists/Domain/Entities/ShoppingList.entity";
import { ShoppingListItem } from "~/ShoppingLists/Domain/Entities/ShoppingListItem.entity";

export class ShoppingListMapper {
  static toDomain(raw: any): ShoppingList {
    const itemEntities =
      raw.items?.map((item: any) =>
        ShoppingListItem.create(
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

    const collaborators =
      raw.collaborators?.map((c: any) => ({
        id: c.id,
        listId: c.listId,
        userId: c.userId,
        role: c.role,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        user: c.user
      })) || [];

    return ShoppingList.create(
      {
        name: raw.name,
        description: raw.description,
        userId: raw.userId,
        items: itemEntities,
        collaborators: collaborators
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

  static toDTO(entity: ShoppingList): any {
    return {
      ...entity.toObject(),
      totalItems: entity.totalItems,
      completedItems: entity.completedItems,
      progressPercentage: entity.progressPercentage,
      totalPrice: entity.totalPrice,
      totalPendingPrice: entity.totalPendingPrice,
      totalCompletedPrice: entity.totalCompletedPrice,
      isEmpty: entity.isEmpty()
    };
  }
}
