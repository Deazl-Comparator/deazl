import type { CreateShoppingList, ShoppingList } from "../Entities/ShoppingList";
import type { CreateShoppingListItem, ShoppingListItem } from "../Entities/ShoppingListItem";

export interface ShoppingListRepository {
  create(data: CreateShoppingList): Promise<ShoppingList>;
  findById(id: string): Promise<ShoppingList | null>;
  findByUserId(userId: string): Promise<ShoppingList[]>;
  update(id: string, data: Partial<CreateShoppingList>): Promise<ShoppingList>;
  delete(id: string): Promise<void>;
  
  // Item methods
  addItem(shoppingListId: string, item: CreateShoppingListItem): Promise<ShoppingListItem>;
  updateItem(id: string, data: Partial<CreateShoppingListItem>): Promise<ShoppingListItem>;
  removeItem(id: string): Promise<void>;
}
