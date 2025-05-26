import { ShoppingListItem } from "~/ShoppingLists/Domain/Entities/ShoppingListItem.entity";

export class ShoppingListItemMapper {
  static toDomain(raw: any): ShoppingListItem {
    return ShoppingListItem.create(
      {
        shoppingListId: raw.shoppingListId,
        productId: raw.productId,
        quantity: raw.quantity,
        unit: raw.unit,
        isCompleted: raw.isCompleted,
        customName: raw.customName,
        price: raw.price,
        notes: raw.notes
      },
      raw.id
    );
  }

  static toPersistence(entity: ShoppingListItem): any {
    return {
      id: entity.id,
      shoppingListId: entity.shoppingListId,
      productId: entity.productId,
      quantity: entity.quantity,
      unit: entity.unit,
      isCompleted: entity.isCompleted,
      customName: entity.customName,
      price: entity.price,
      notes: entity.notes,
      updatedAt: new Date()
    };
  }
}
