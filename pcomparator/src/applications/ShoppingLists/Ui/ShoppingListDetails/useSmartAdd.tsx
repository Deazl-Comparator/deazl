"use client";

import { addToast } from "@heroui/react";
import { Trans } from "@lingui/react/macro";
import { useState } from "react";
import { addItemToList } from "~/applications/ShoppingLists/Api/addItemToList.api";
import { addProductItemToList } from "~/applications/ShoppingLists/Api/addProductItemToList.api";
import type { ProductSearchResult } from "~/applications/ShoppingLists/Api/searchProducts.api";

interface UseSmartAddProps {
  listId: string;
  onItemAdded?: (item: any) => void;
}

export const useSmartAdd = ({ listId, onItemAdded }: UseSmartAddProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addCustomItem = async (itemData: {
    customName: string;
    quantity: number;
    unit: string;
    price?: number;
    isCompleted?: boolean;
  }) => {
    if (isSubmitting) return;

    console.log("useSmartAdd: Adding custom item to list:", listId, itemData);

    try {
      setIsSubmitting(true);

      const newItem = await addItemToList(listId, itemData);

      console.log("useSmartAdd: Item added successfully:", newItem);

      if (onItemAdded && newItem) {
        onItemAdded(newItem);
      }

      let successMessage = `${itemData.customName} (${itemData.quantity} ${itemData.unit})`;
      if (itemData.price) {
        successMessage += ` - ${itemData.price.toFixed(2)}€`;
      }

      addToast({
        title: <Trans>Article ajouté</Trans>,
        description: successMessage,
        variant: "solid",
        color: "success"
      });
    } catch (error) {
      console.error("Error adding custom item:", error);
      addToast({
        title: <Trans>Erreur</Trans>,
        description: <Trans>Impossible d'ajouter l'article</Trans>,
        variant: "solid",
        color: "danger"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addProductItem = async (
    product: ProductSearchResult,
    quantity: number,
    unit: string,
    price?: number,
    customName?: string
  ) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const newItem = await addProductItemToList(listId, {
        productId: product.id,
        productName: product.name, // Ajouter le nom du produit
        quantity,
        unit,
        price,
        customName,
        isCompleted: false
      });

      if (onItemAdded && newItem) {
        onItemAdded(newItem);
      }

      let successMessage = `${customName || product.name} (${quantity} ${unit})`;
      if (price) {
        successMessage += ` - ${price.toFixed(2)}€`;
      }
      if (product.brand) {
        successMessage += ` • ${product.brand.name}`;
      }

      addToast({
        title: <Trans>Produit ajouté</Trans>,
        description: successMessage,
        variant: "solid",
        color: "success"
      });
    } catch (error) {
      console.error("Error adding product item:", error);
      addToast({
        title: <Trans>Erreur</Trans>,
        description: <Trans>Impossible d'ajouter le produit</Trans>,
        variant: "solid",
        color: "danger"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    addCustomItem,
    addProductItem,
    isSubmitting
  };
};
