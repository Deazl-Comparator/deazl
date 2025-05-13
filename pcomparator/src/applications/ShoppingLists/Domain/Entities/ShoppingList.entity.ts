import { DomainError } from "~/applications/Shared/Domain/Core/DomainError";
import { Entity } from "~/applications/Shared/Domain/Core/Entity";
import { UniqueEntityID } from "~/applications/Shared/Domain/Core/UniqueEntityId";
import type { ShoppingList as ShoppingListT } from "./ShoppingList";
import type { ShoppingListItemEntity } from "./ShoppingListItem.entity";

export class ListNameTooShortError extends DomainError {
  constructor() {
    super("List name must be at least 2 characters long");
  }
}

interface ShoppingListProps {
  name: string;
  description?: string;
  userId: string;
  items: ShoppingListItemEntity[];
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
      items?: ShoppingListItemEntity[];
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

  get items(): ShoppingListItemEntity[] {
    return this.props.items;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  public updateName(name: string): void {
    if (name.length < 2) {
      throw new ListNameTooShortError();
    }
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  public updateDescription(description: string): void {
    this.props.description = description;
    this.props.updatedAt = new Date();
  }

  public addItem(item: ShoppingListItemEntity): void {
    this.props.items.push(item);
    this.props.updatedAt = new Date();
  }

  public removeItem(itemId: string): void {
    this.props.items = this.props.items.filter((item) => item.id !== itemId);
    this.props.updatedAt = new Date();
  }

  public getItemById(itemId: string): ShoppingListItemEntity | undefined {
    return this.props.items.find((item) => item.id === itemId);
  }

  public updateItem(itemId: string, updateFn: (item: ShoppingListItemEntity) => void): void {
    const item = this.getItemById(itemId);
    if (!item) return;

    updateFn(item);
    this.props.updatedAt = new Date();
  }

  public getCompletedItems(): ShoppingListItemEntity[] {
    return this.props.items.filter((item) => item.isCompleted);
  }

  public getPendingItems(): ShoppingListItemEntity[] {
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

  public toObject(): ShoppingListT {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      userId: this.userId,
      items: this.items.map((item) => item.toObject()),
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
