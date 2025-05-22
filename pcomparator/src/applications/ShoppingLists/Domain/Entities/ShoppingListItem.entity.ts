import { z } from "zod";
import { DomainError } from "~/applications/Shared/Domain/Core/DomainError";
import { Entity } from "~/applications/Shared/Domain/Core/Entity";
import { UniqueEntityID } from "~/applications/Shared/Domain/Core/UniqueEntityId";
import { BusinessRuleViolationError } from "~/applications/ShoppingLists/Domain/Errors/ShoppingListItemEntity.error";
import type { ShoppingListItemSchema } from "~/applications/ShoppingLists/Domain/Schemas/ShoppingListItem.schema";
import { ItemQuantity } from "../ValueObjects/ItemQuantity";
import { ItemStatus } from "../ValueObjects/ItemStatus";
import { Price } from "../ValueObjects/Price";
import { Unit } from "../ValueObjects/Unit";

export class ItemNameTooShortError extends DomainError {
  constructor() {
    super("Item name must be at least 2 characters long");
  }
}

export type ShoppingListItemPayload = z.infer<typeof ShoppingListItemSchema>;

export interface ShoppingListItemProps {
  shoppingListId: string;
  productId?: string | null;
  quantity: ItemQuantity;
  unit: Unit;
  status: ItemStatus;
  customName?: string;
  totalPrice?: Price | null; // Total price for the item quantity
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
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
      price?: number | null; // Total price for item quantity
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
        totalPrice: props.price !== undefined ? Price.create(props.price) : undefined,
        notes: props.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      id ? new UniqueEntityID(id) : undefined
    );

    return itemEntity;
  }

  public withUpdates(
    updates: Partial<
      Pick<ShoppingListItemPayload, "customName" | "quantity" | "unit" | "price" | "isCompleted">
    >,
    shoppingListItemId: string
  ): ShoppingListItemEntity {
    try {
      // Check if user has editor or owner role to update the item

      return ShoppingListItemEntity.create(
        {
          shoppingListId: this.shoppingListId,
          productId: this.productId,
          quantity: updates.quantity ?? this.quantity,
          unit: updates.unit ?? this.unit,
          isCompleted: updates.isCompleted ?? this.isCompleted,
          customName: updates.customName ?? this.customName,
          price: updates.price ?? this.price
        },
        shoppingListItemId
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];

        throw new BusinessRuleViolationError(firstError.message);
      }
      throw error;
    }
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
    return this.props.totalPrice?.value;
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

  // Calculate the unit price based on total price and quantity
  public getUnitPrice(): Price | null {
    const totalPrice = this.props.totalPrice;
    if (!totalPrice || totalPrice.value === null || !this.props.quantity) {
      return null;
    }
    return Price.create(totalPrice.value / this.props.quantity.value);
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
    this.props.totalPrice = Price.create(price);
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

  public toObject(): ShoppingListItemPayload {
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
