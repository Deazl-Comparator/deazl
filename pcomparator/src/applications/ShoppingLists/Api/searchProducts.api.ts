"use server";

import { PrismaSearchRepository } from "~/applications/Searchbar/Infrastructure/Repositories/PrismaSearchRepository";

export interface ProductSearchResult {
  id: string;
  name: string;
  barcode: string;
  brand?: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    name: string;
  };
  prices: {
    id: string;
    amount: number;
    currency: string;
    unit: string;
    store: {
      id: string;
      name: string;
      location: string;
    };
    dateRecorded: Date;
  }[];
  averagePrice?: number;
  bestPrice?: {
    amount: number;
    store: string;
    location: string;
  };
}

const searchRepository = new PrismaSearchRepository();

export const searchProducts = async (query: string): Promise<ProductSearchResult[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    // Utiliser le repository existant mais avec une recherche étendue
    const prices = await searchRepository.search(query.trim());

    if (!prices || prices.length === 0) {
      return [];
    }

    // Grouper les prix par produit
    const productMap = new Map<string, ProductSearchResult>();

    for (const price of prices) {
      const productId = (price as any).product.id;
      const productData = (price as any).product;

      if (!productMap.has(productId)) {
        productMap.set(productId, {
          id: productId,
          name: productData.name,
          barcode: productData.barcode,
          brand: productData.brand
            ? {
                id: productData.brand.id,
                name: productData.brand.name
              }
            : undefined,
          category: productData.category
            ? {
                id: productData.category.id,
                name: productData.category.name
              }
            : undefined,
          prices: []
        });
      }

      const product = productMap.get(productId)!;
      product.prices.push({
        id: price.id,
        amount: price.amount,
        currency: price.currency,
        unit: "kg", // TODO: Récupérer l'unité depuis la base
        store: {
          id: (price as any).store.id,
          name: (price as any).store.name,
          location: (price as any).store.location
        },
        dateRecorded: price.dateRecorded || new Date()
      });
    }

    // Calculer les statistiques de prix pour chaque produit
    const results = Array.from(productMap.values()).map((product) => {
      const prices = product.prices.map((p) => p.amount);
      const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

      const bestPriceIndex = prices.indexOf(Math.min(...prices));
      const bestPrice = product.prices[bestPriceIndex];

      return {
        ...product,
        averagePrice: Math.round(averagePrice * 100) / 100,
        bestPrice: {
          amount: bestPrice.amount,
          store: bestPrice.store.name,
          location: bestPrice.store.location
        }
      };
    });

    // Trier par pertinence (nom exact en premier, puis alphabétique)
    return results.sort((a, b) => {
      const aExact = a.name.toLowerCase() === query.toLowerCase();
      const bExact = b.name.toLowerCase() === query.toLowerCase();

      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};
