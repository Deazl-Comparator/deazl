"use client";

import { addToast } from "@heroui/react";
import { Trans } from "@lingui/react/macro";
import { useState } from "react";
import { addProductItemToList } from "~/Api/addProductItemToList.api";
import { addItemToList } from "~/Api/items/addItemToList.api";
import type { ProductSearchResult } from "~/Api/searchProducts.api";

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
        title: <Trans>Item added</Trans>,
        description: successMessage,
        variant: "solid",
        color: "success"
      });
    } catch (error) {
      console.error("Error adding custom item:", error);
      addToast({
        title: <Trans>Error</Trans>,
        description: <Trans>Unable to add item</Trans>,
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
        productName: product.name,
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
        title: <Trans>Product added</Trans>,
        description: successMessage,
        variant: "solid",
        color: "success"
      });
    } catch (error) {
      console.error("Error adding product item:", error);
      addToast({
        title: <Trans>Error</Trans>,
        description: <Trans>Unable to add product</Trans>,
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
