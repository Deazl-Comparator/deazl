"use client";

import { useCallback, useState } from "react";
import type { ShoppingListItemPayload } from "~/ShoppingLists/Domain/Entities/ShoppingListItem.entity";

/**
 * Hook pour gérer les suggestions de création de produits
 */
export const useProductSuggestion = () => {
  const [suggestedItem, setSuggestedItem] = useState<ShoppingListItemPayload | null>(null);
  const [neverAskAgainItems, setNeverAskAgainItems] = useState<Set<string>>(new Set());

  // Vérifie si un item est éligible pour une suggestion
  const isEligibleForSuggestion = useCallback(
    (item: ShoppingListItemPayload): boolean => {
      return !!(
        item.customName &&
        item.customName.trim().length > 0 &&
        item.price &&
        item.price > 0 &&
        !neverAskAgainItems.has(item.id)
      );
    },
    [neverAskAgainItems]
  );

  // Déclenche une suggestion pour un item
  const triggerSuggestion = useCallback(
    (item: ShoppingListItemPayload) => {
      if (isEligibleForSuggestion(item)) {
        setSuggestedItem(item);
      }
    },
    [isEligibleForSuggestion]
  );

  // Ferme la suggestion
  const closeSuggestion = useCallback(() => {
    setSuggestedItem(null);
  }, []);

  // Marque un item comme "ne plus jamais demander"
  const neverAskAgain = useCallback((itemId: string) => {
    setNeverAskAgainItems((prev) => new Set([...prev, itemId]));
    setSuggestedItem(null);
  }, []);

  return {
    suggestedItem,
    isEligibleForSuggestion,
    triggerSuggestion,
    closeSuggestion,
    neverAskAgain
  };
};
