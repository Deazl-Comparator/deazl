import type { z } from "zod";
import { DomainError } from "~/Shared/Domain/Core/DomainError";
import { Entity } from "~/Shared/Domain/Core/Entity";
import { UniqueEntityID } from "~/Shared/Domain/Core/UniqueEntityId";
import type { ShoppingListCollaboratorPayload } from "~/ShoppingLists/Domain/Entities/ShoppingListCollaborator.entity";
import type { ShoppingListItem } from "~/ShoppingLists/Domain/Entities/ShoppingListItem.entity";
import type { ShoppingListSchema } from "~/ShoppingLists/Domain/Schemas/ShoppingList.schema";
import type { UserRoleEnum } from "~/ShoppingLists/Domain/Schemas/UserRole.schema";

export class ListNameTooShortError extends DomainError {
  constructor() {
    super("List name must be at least 2 characters long");
  }
}

export type UserRole = z.infer<typeof UserRoleEnum>;

export type ShoppingListPayload = z.infer<typeof ShoppingListSchema> & {
  totalItems: number;
  completedItems: number;
  progressPercentage: number;
  totalPrice: number;
  totalPendingPrice: number;
  totalCompletedPrice: number;
  userRole?: UserRole;
};

interface ShoppingListProps {
  name: string;
  description?: string;
  userId: string;
  items: ShoppingListItem[];
  collaborators?: ShoppingListCollaboratorPayload[];
  isPublic: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ShoppingList extends Entity<ShoppingListProps> {
  private constructor(props: ShoppingListProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: {
      name: string;
      description?: string;
      userId: string;
      items?: ShoppingListItem[];
      collaborators?: ShoppingListCollaboratorPayload[];
      isPublic?: boolean;
    },
    id?: string
  ): ShoppingList {
    if (props.name.length < 2) throw new ListNameTooShortError();

    const listEntity = new ShoppingList(
      {
        name: props.name,
        description: props.description,
        userId: props.userId,
        items: props.items || [],
        collaborators: props.collaborators || [],
        isPublic: props.isPublic ?? false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      id ? new UniqueEntityID(id) : undefined
    );

    return listEntity;
  }

  get id(): string {
    return this._id.toString();
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get userId(): string {
    return this.props.userId;
  }

  get collaborators(): ShoppingListCollaboratorPayload[] | undefined {
    return this.props.collaborators;
  }

  get items(): ShoppingListItem[] {
    return this.props.items;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get isPublic(): boolean {
    return this.props.isPublic;
  }

  // Immutable update methods - return new instances
  public withName(name: string): ShoppingList {
    if (name.length < 2) {
      throw new ListNameTooShortError();
    }
    return new ShoppingList(
      {
        ...this.props,
        name,
        updatedAt: new Date()
      },
      this._id
    );
  }

  public withDescription(description: string): ShoppingList {
    return new ShoppingList(
      {
        ...this.props,
        description,
        updatedAt: new Date()
      },
      this._id
    );
  }

  public withItem(item: ShoppingListItem): ShoppingList {
    return new ShoppingList(
      {
        ...this.props,
        items: [...this.props.items, item],
        updatedAt: new Date()
      },
      this._id
    );
  }

  public withoutItem(itemId: string): ShoppingList {
    return new ShoppingList(
      {
        ...this.props,
        items: this.props.items.filter((item) => item.id !== itemId),
        updatedAt: new Date()
      },
      this._id
    );
  }

  public withUpdatedItem(itemId: string, updatedItem: ShoppingListItem): ShoppingList {
    const updatedItems = this.props.items.map((item) => (item.id === itemId ? updatedItem : item));

    return new ShoppingList(
      {
        ...this.props,
        items: updatedItems,
        updatedAt: new Date()
      },
      this._id
    );
  }

  // Query methods (read-only operations)
  public getItemById(itemId: string): ShoppingListItem | undefined {
    return this.props.items.find((item) => item.id === itemId);
  }

  public getCompletedItems(): ShoppingListItem[] {
    return this.props.items.filter((item) => item.isCompleted);
  }

  public getPendingItems(): ShoppingListItem[] {
    return this.props.items.filter((item) => !item.isCompleted);
  }

  public get totalItems(): number {
    return this.props.items.length;
  }

  public get completedItems(): number {
    return this.getCompletedItems().length;
  }

  public get progressPercentage(): number {
    if (this.totalItems === 0) return 0;
    return Math.round((this.completedItems / this.totalItems) * 100);
  }

  public get totalPrice(): number {
    return this.props.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  public get totalPendingPrice(): number {
    return this.getPendingItems().reduce((sum, item) => sum + (item.price || 0), 0);
  }

  public get totalCompletedPrice(): number {
    return this.getCompletedItems().reduce((sum, item) => sum + (item.price || 0), 0);
  }

  public isEmpty(): boolean {
    return this.props.items.length === 0;
  }

  public canBeShared(): boolean {
    return !!this.name?.trim();
  }

  public toObject(): ShoppingListPayload {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      userId: this.userId,
      isPublic: this.isPublic,
      items: this.items.map((item) => item.toObject()),
      collaborators: this.collaborators,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      totalItems: this.totalItems,
      completedItems: this.completedItems,
      progressPercentage: this.progressPercentage,
      totalPrice: this.totalPrice,
      totalPendingPrice: this.totalPendingPrice,
      totalCompletedPrice: this.totalCompletedPrice
    };
  }
}
