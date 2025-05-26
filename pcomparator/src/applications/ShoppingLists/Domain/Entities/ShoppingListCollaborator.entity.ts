import type { z } from "zod";
import { Entity } from "~/Shared/Domain/Core/Entity";
import { UniqueEntityID } from "~/Shared/Domain/Core/UniqueEntityId";
import type { ShoppingListCollaboratorSchema } from "~/ShoppingLists/Domain/Schemas/ShoppingList.schema";

export enum CollaboratorRole {
  OWNER = "OWNER",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER"
}

interface CollaboratorProps {
  listId: string;
  userId: string;
  role: CollaboratorRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ShoppingListCollaboratorPayload = z.infer<typeof ShoppingListCollaboratorSchema>;

export class ShoppingListCollaborator extends Entity<CollaboratorProps> {
  private constructor(props: CollaboratorProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: CollaboratorProps, id?: string): ShoppingListCollaborator {
    return new ShoppingListCollaborator(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date()
      },
      id ? new UniqueEntityID(id) : undefined
    );
  }

  get listId(): string {
    return this.props.listId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get role(): CollaboratorRole {
    return this.props.role;
  }

  public updateRole(role: CollaboratorRole): void {
    this.props.role = role;
    this.props.updatedAt = new Date();
  }
}
