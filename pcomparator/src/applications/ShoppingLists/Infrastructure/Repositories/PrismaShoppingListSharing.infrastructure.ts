import { v4 as uuidv4 } from "uuid";
import type { ShoppingList } from "~/ShoppingLists/Domain/Entities/ShoppingList.entity";
import type {
  CollaboratorRole,
  ShoppingListCollaborator
} from "~/ShoppingLists/Domain/Entities/ShoppingListCollaborator.entity";
import type { ShoppingListSharingRepository } from "~/ShoppingLists/Domain/Repositories/ShoppingListSharingRepository";
import { ShoppingListCollaboratorMapper } from "~/ShoppingLists/Infrastructure/Mappers/ShoppingListCollaboratorMapper";
import { ShoppingListMapper } from "~/ShoppingLists/Infrastructure/Mappers/ShoppingListMapper";
import { prisma } from "~/libraries/prisma";

export class PrismaShoppingListSharingRepository implements ShoppingListSharingRepository {
  async findUserByEmail(email: string): Promise<{ id: string; email: string } | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true }
    });
    return user;
  }

  async findUserById(id: string): Promise<{ id: string; email: string } | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true
      }
    });
  }

  async generateShareToken(listId: string): Promise<string> {
    const token = uuidv4();
    await prisma.shoppingList.update({
      where: { id: listId },
      data: { shareToken: token }
    });
    return token;
  }

  async getByShareToken(token: string): Promise<ShoppingList | null> {
    const list = await prisma.shoppingList.findUnique({
      where: { shareToken: token },
      include: {
        items: true,
        collaborators: {
          include: {
            user: true
          }
        }
      }
    });

    if (!list) return null;

    return ShoppingListMapper.toDomain(list);
  }

  async updatePublicStatus(listId: string, isPublic: boolean): Promise<void> {
    await prisma.shoppingList.update({
      where: { id: listId },
      data: { isPublic }
    });
  }

  async addCollaborator(
    listId: string,
    email: string,
    role: CollaboratorRole
  ): Promise<ShoppingListCollaborator> {
    try {
      // First find the user by email
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }

      // Use a transaction to ensure all operations complete or none do
      const collaborator = await prisma.$transaction(async (tx) => {
        // Check if the user is already a collaborator
        const existingCollaborator = await tx.shoppingListCollaborator.findFirst({
          where: {
            listId: listId,
            userId: user.id
          }
        });

        if (existingCollaborator) {
          // If they are, update their role instead of throwing an error
          const updated = await tx.shoppingListCollaborator.update({
            where: { id: existingCollaborator.id },
            data: { role },
            include: { user: true }
          });
          return updated;
        }

        // Add the user as a collaborator if they don't exist
        return tx.shoppingListCollaborator.create({
          data: {
            id: uuidv4(),
            listId: listId,
            userId: user.id,
            role
          },
          include: {
            user: true
          }
        });
      });

      return ShoppingListCollaboratorMapper.toDomain(collaborator);
    } catch (error) {
      console.error("Error in addCollaborator:", error);
      throw error;
    }
  }

  async removeCollaborator(listId: string, userId: string): Promise<void> {
    await prisma.shoppingListCollaborator.deleteMany({
      where: {
        listId,
        userId
      }
    });
  }

  async updateCollaboratorRole(listId: string, userId: string, role: CollaboratorRole): Promise<void> {
    await prisma.shoppingListCollaborator.updateMany({
      where: {
        listId,
        userId
      },
      data: { role }
    });
  }

  async getCollaborators(listId: string): Promise<ShoppingListCollaborator[]> {
    const collaborators = await prisma.shoppingListCollaborator.findMany({
      where: { listId },
      include: { user: true }
    });

    return collaborators.map((c) => ShoppingListCollaboratorMapper.toDomain(c));
  }
}
