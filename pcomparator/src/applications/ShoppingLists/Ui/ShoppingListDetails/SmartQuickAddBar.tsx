"use client";

import { useDisclosure } from "@heroui/react";
import { Trans } from "@lingui/react/macro";
import { SparklesIcon } from "lucide-react";
import { useState } from "react";
import type { ProductSearchResult } from "~/applications/ShoppingLists/Api/searchProducts.api";
import { ProductAutocomplete } from "./ProductAutocomplete";
import { ProductSelectionModal } from "./ProductSelectionModal";
import { useQuickAdd } from "./useQuickAdd";

interface SmartQuickAddBarProps {
  listId: string;
  className?: string;
  onItemAdded?: (item: any) => void;
}

export const SmartQuickAddBar = ({ listId, className = "", onItemAdded }: SmartQuickAddBarProps) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductSearchResult | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { inputValue, setInputValue, handleKeyDown, inputRef, handleAddItem, isSubmitting } = useQuickAdd(
    listId,
    onItemAdded
  );

  const handleProductSelect = (product: ProductSearchResult) => {
    setSelectedProduct(product);
    onOpen();
  };

  // Amélioration du gestionnaire de touches pour supporter à la fois la recherche et l'ajout manuel
  const handleEnhancedKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();

      // Si l'input ressemble à une saisie manuelle (quantité + nom + prix optionnel)
      const manualInputRegex = /^([\d.,]+)\s*([a-zA-Z]{1,2})?\s+(.+?)(?:\s+([\d.,]+)(?:€|\$|£)?)?$/;
      if (manualInputRegex.test(inputValue.trim())) {
        // Utiliser la logique d'ajout manuel
        handleAddItem();
      }
      // Sinon, si c'est juste un nom de produit, laisser la recherche se faire
    }
  };

  const handleProductConfirm = async (selection: {
    productId: string;
    quantity: number;
    unit: string;
    price?: number;
    store?: {
      id: string;
      name: string;
      location: string;
    };
  }) => {
    try {
      // Utiliser l'API existante mais avec les données du produit
      const { addItemToList } = await import("~/ShoppingLists/Api/addItemToList.api");

      const newItem = await addItemToList(listId, {
        productId: selection.productId,
        quantity: selection.quantity,
        unit: selection.unit,
        price: selection.price,
        isCompleted: false
      });

      if (onItemAdded && newItem) {
        onItemAdded(newItem);
      }
    } catch (error) {
      console.error("Error adding product to list:", error);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* En-tête avec titre */}
      <div className="flex items-center gap-2">
        <SparklesIcon size={20} className="text-primary-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          <Trans>Add Items</Trans>
        </h3>
      </div>

      {/* Interface unifiée */}
      <div className="space-y-4">
        {/* Barre de recherche intelligente */}
        <div className="relative">
          <ProductAutocomplete
            onProductSelect={handleProductSelect}
            placeholder="Search products or type to add manually (e.g., '2 kg apples' or '1 bottle milk 2.50€')..."
            className="w-full"
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={handleEnhancedKeyDown}
            isDisabled={isSubmitting}
          />
          {isSubmitting && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500" />
            </div>
          )}
        </div>

        {/* Aide contextuelle */}
        <div className="text-xs text-gray-500 space-y-1 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="flex items-center gap-2 font-medium text-blue-900 dark:text-blue-100">
            <SparklesIcon className="w-4 h-4" />
            <Trans>Smart Input Examples</Trans>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4 text-blue-700 dark:text-blue-300">
            <li>
              <Trans>"apples" → Search for products</Trans>
            </li>
            <li>
              <Trans>"2 kg apples" → Quick add with quantity</Trans>
            </li>
            <li>
              <Trans>"1 bottle milk 2.50€" → Add with price</Trans>
            </li>
          </ul>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            <Trans>Press Enter to execute • Products show prices from multiple stores</Trans>
          </p>
        </div>
      </div>

      {/* Modal de sélection de produit */}
      <ProductSelectionModal
        isOpen={isOpen}
        onClose={onClose}
        product={selectedProduct}
        onConfirm={handleProductConfirm}
      />
    </div>
  );
};
