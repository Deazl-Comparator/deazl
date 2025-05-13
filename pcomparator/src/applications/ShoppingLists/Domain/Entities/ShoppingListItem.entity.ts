import { DomainError } from "~/applications/Shared/Domain/Core/DomainError";
import { Entity } from "~/applications/Shared/Domain/Core/Entity";
import { UniqueEntityID } from "~/applications/Shared/Domain/Core/UniqueEntityId";
import { ItemQuantity } from "../ValueObjects/ItemQuantity";
import { ItemStatus } from "../ValueObjects/ItemStatus";
import { Price } from "../ValueObjects/Price";
import { Unit } from "../ValueObjects/Unit";
import type { ShoppingListItem as ShoppingListItemT } from "./ShoppingListItem";

export class ItemNameTooShortError extends DomainError {
  constructor() {
    super("Item name must be at least 2 characters long");
  }
}

interface ShoppingListItemProps {
  shoppingListId: string;
  productId?: string | null;
  quantity: ItemQuantity;
  unit: Unit;
  status: ItemStatus;
  customName?: string;
  price?: Price;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ShoppingListItemEntity extends Entity<ShoppingListItemProps> {
  private constructor(props: ShoppingListItemProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: {
      shoppingListId: string;
      productId?: string | null;
      quantity: number;
      unit: string;
      isCompleted?: boolean;
      customName?: string;
      price?: number | null;
      notes?: string | null;
    },
    id?: string
  ): ShoppingListItemEntity {
    if (props.customName && props.customName.length < 2) {
      throw new ItemNameTooShortError();
    }

    const itemEntity = new ShoppingListItemEntity(
      {
        shoppingListId: props.shoppingListId,
        productId: props.productId,
        quantity: ItemQuantity.create(props.quantity),
        unit: Unit.create(props.unit),
        status: ItemStatus.create(props.isCompleted || false),
        customName: props.customName,
        price: props.price !== undefined ? Price.create(props.price) : undefined,
        notes: props.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      id ? new UniqueEntityID(id) : undefined
    );

    return itemEntity;
  }

  get id(): string {
    return this._id.toString();
  }

  get shoppingListId(): string {
    return this.props.shoppingListId;
  }

  get productId(): string | null | undefined {
    return this.props.productId;
  }

  get quantity(): number {
    return this.props.quantity.value;
  }

  get unit(): string {
    return this.props.unit.value;
  }

  get isCompleted(): boolean {
    return this.props.status.isCompleted;
  }

  get customName(): string | undefined {
    return this.props.customName;
  }

  get price(): number | null | undefined {
    return this.props.price?.value;
  }

  get notes(): string | null | undefined {
    return this.props.notes;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  public updateQuantity(quantity: number): void {
    this.props.quantity = ItemQuantity.create(quantity);
    this.props.updatedAt = new Date();
  }

  public updateUnit(unit: string): void {
    this.props.unit = Unit.create(unit);
    this.props.updatedAt = new Date();
  }

  public updateName(name: string): void {
    if (name && name.length < 2) {
      throw new ItemNameTooShortError();
    }
    this.props.customName = name;
    this.props.updatedAt = new Date();
  }

  public updatePrice(price: number | null): void {
    this.props.price = Price.create(price);
    this.props.updatedAt = new Date();
  }

  public updateNotes(notes: string | null): void {
    this.props.notes = notes;
    this.props.updatedAt = new Date();
  }

  public toggleCompletion(): void {
    this.props.status = this.props.status.toggle();
    this.props.updatedAt = new Date();
  }

  public complete(): void {
    this.props.status = this.props.status.complete();
    this.props.updatedAt = new Date();
  }

  public reset(): void {
    this.props.status = this.props.status.reset();
    this.props.updatedAt = new Date();
  }

  public toObject(): ShoppingListItemT {
    return {
      id: this.id,
      shoppingListId: this.shoppingListId,
      productId: this.productId,
      quantity: this.quantity,
      // @ts-ignore
      unit: this.unit,
      isCompleted: this.isCompleted,
      customName: this.customName,
      // @ts-ignore
      price: this.price,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
