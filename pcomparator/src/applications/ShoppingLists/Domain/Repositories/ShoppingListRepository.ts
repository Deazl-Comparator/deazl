import type { ShoppingList } from "../Entities/ShoppingList.entity";
import type { ShoppingListItemEntity } from "../Entities/ShoppingListItem.entity";

export interface ShoppingListRepository {
  create(list: ShoppingList): Promise<ShoppingList>;
  findById(id: string): Promise<ShoppingList | null>;
  findByUserId(userId: string): Promise<ShoppingList[]>;
  update(list: ShoppingList): Promise<ShoppingList>;
  delete(id: string): Promise<void>;
  addItem(listId: string, item: ShoppingListItemEntity): Promise<ShoppingListItemEntity>;
  updateItem(item: ShoppingListItemEntity): Promise<ShoppingListItemEntity>;
  removeItem(itemId: string): Promise<void>;
}
