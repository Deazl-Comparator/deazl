import { prisma } from "~/libraries/prisma";
import type { ProductInformation } from "../../Domain/ValueObjects/ProductInformation";

export class CreateProductFromItemUseCase {
  async execute(productInfo: ProductInformation): Promise<any> {
    // Générer un code-barres aléatoire (à des fins de démonstration)
    const randomBarcode = `MANUAL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Transaction pour créer à la fois le produit, la marque, le magasin et le prix
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

      // 4. Créer l'enregistrement de prix
      const priceRecord = await tx.price.create({
        data: {
          product_id: product.id,
          store_id: store.id,
          amount: productInfo.price,
          currency: "EUR"
        },
        include: {
          product: true,
          store: true
        }
      });

      return {
        product,
        brand,
        store,
        priceRecord
      };
    });

    return result;
  }
}
