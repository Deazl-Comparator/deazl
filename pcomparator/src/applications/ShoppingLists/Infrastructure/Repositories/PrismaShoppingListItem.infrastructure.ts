import { prisma } from "~/libraries/prisma";
import type { ShoppingListItemEntity } from "../../Domain/Entities/ShoppingListItem.entity";
import type { ShoppingListItemRepository } from "../../Domain/Repositories/ShoppingListItemRepository";
import { ShoppingListItemMapper } from "../Mappers/ShoppingListItemMapper";

export class PrismaShoppingListItemRepository implements ShoppingListItemRepository {
  async addItem(listId: string, item: ShoppingListItemEntity): Promise<ShoppingListItemEntity> {
    const itemData = ShoppingListItemMapper.toPersistence(item);

    const newItem = await prisma.shoppingListItem.create({
      data: {
        shoppingListId: listId,
        productId: itemData.productId,
        quantity: itemData.quantity,
        unit: itemData.unit,
        isCompleted: itemData.isCompleted,
        customName: itemData.customName,
        price: itemData.price
        // notes: itemData.notes
      }
    });

    return ShoppingListItemMapper.toDomain(newItem);
  }

  async updateItem(item: ShoppingListItemEntity): Promise<ShoppingListItemEntity> {
    const itemData = ShoppingListItemMapper.toPersistence(item);

    const updatedItem = await prisma.shoppingListItem.update({
      where: { id: item.id },
      data: {
        quantity: itemData.quantity,
        unit: itemData.unit,
        isCompleted: itemData.isCompleted,
        customName: itemData.customName,
        price: itemData.price,
        // notes: itemData.notes,
        updatedAt: new Date()
      }
    });

    return ShoppingListItemMapper.toDomain(updatedItem);
  }

  async removeItem(itemId: string): Promise<void> {
    await prisma.shoppingListItem.delete({
      where: { id: itemId }
    });
  }

  async findItemById(id: string): Promise<ShoppingListItemEntity | null> {
    const item = await prisma.shoppingListItem.findUnique({
      where: { id }
    });

    if (!item) return null;

    return ShoppingListItemMapper.toDomain(item);
  }

  async createProductFromItem(productInfo: {
    name: string;
    price: number;
    unit: string;
    quantity: number;
    brandName: string;
    storeName: string;
    storeLocation: string;
    referencePrice: number;
    referenceUnit: string;
  }) {
    const randomBarcode = `MANUAL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Vérifier que le prix de référence est fourni
    if (!productInfo.referencePrice) throw new Error("Reference price is required to create a product");

    // Transaction pour créer le produit, la marque, le magasin et le prix
    const result = await prisma.$transaction(async (tx) => {
      // 1. Vérifier/créer la marque
      let brand = await tx.brand.findFirst({
        where: { name: productInfo.brandName }
      });

      if (!brand) {
        brand = await tx.brand.create({
          data: {
            name: productInfo.brandName,
            description: `Brand created from shopping list item for ${productInfo.name}`
          }
        });
      }

      // 2. Vérifier/créer le magasin
      let store = await tx.store.findFirst({
        where: {
          name: productInfo.storeName,
          location: productInfo.storeLocation
        }
      });

      if (!store) {
        store = await tx.store.create({
          data: {
            name: productInfo.storeName,
            location: productInfo.storeLocation
          }
        });
      }

      // 3. Créer le produit
      const product = await tx.product.create({
        data: {
          name: productInfo.name,
          barcode: randomBarcode,
          description: "",
          brand_id: brand.id
        }
      });

      // 4. Créer l'enregistrement de prix avec le prix de référence
      const priceRecord = await tx.price.create({
        data: {
          product_id: product.id,
          store_id: store.id,
          amount: productInfo.referencePrice,
          unit: productInfo.referenceUnit,
          currency: "EUR"
        },
        include: {
          product: true,
          store: true
        }
      });

      // return {
      //   product,
      //   brand,
      //   store,
      //   priceRecord
      // };
    });

    return result;
  }
}
