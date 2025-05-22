import type {
  CollaboratorRole,
  ShoppingListCollaborator
} from "~/applications/ShoppingLists/Domain/Entities/ShoppingListCollaborator.entity";
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
  createProductFromItem(productInfo: {
    name: string;
    price: number;
    unit: string;
    quantity: number;
    brandName: string;
    storeName: string;
    storeLocation: string;
    referencePrice: number;
    referenceUnit: string;
  }): Promise<void>;
  updatePublicStatus(listId: string, isPublic: boolean): Promise<void>;
  generateShareToken(listId: string): Promise<string>;
  getByShareToken(token: string): Promise<ShoppingList | null>;
  addCollaborator(listId: string, email: string, role: CollaboratorRole): Promise<ShoppingListCollaborator>;
  removeCollaborator(listId: string, userId: string): Promise<void>;
  updateCollaboratorRole(listId: string, userId: string, role: CollaboratorRole): Promise<void>;
  getCollaborators(listId: string): Promise<ShoppingListCollaborator[]>;
  findItemById(id: string): Promise<ShoppingListItemEntity | null>;
  findUserByEmail(email: string): Promise<{ id: string; email: string } | null>;
  findUserById(id: string): Promise<{ id: string; email: string } | null>;
}
