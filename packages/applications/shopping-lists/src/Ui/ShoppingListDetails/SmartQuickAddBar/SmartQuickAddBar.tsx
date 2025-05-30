"use client";

import { useDisclosure } from "@heroui/react";
import { useState } from "react";
import type { ProductSearchResult } from "../../../Api/searchProducts.api";
import { ProductSelectionModal } from "../ProductSelectionModal";
import { SmartItemInput } from "./SmartItemInput";
import { useSmartAdd } from "./useSmartAdd";

interface SmartQuickAddBarProps {
  listId: string;
  className?: string;
  onItemAdded?: (item: any) => void;
}

export const SmartQuickAddBar = ({ listId, className = "", onItemAdded }: SmartQuickAddBarProps) => {
  const { addCustomItem, addProductItem, isSubmitting } = useSmartAdd({
    listId,
    onItemAdded
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<ProductSearchResult | null>(null);
  const [pendingQuantity, setPendingQuantity] = useState(1);
  const [pendingUnit, setPendingUnit] = useState("unit");
  const [pendingPrice, setPendingPrice] = useState<number | undefined>();

  const handleProductSelected = (
    product: ProductSearchResult,
    quantity: number,
    unit: string,
    price?: number
  ) => {
    // Si le produit a des prix disponibles, ouvrir le modal de sélection
    if (product.prices && product.prices.length > 0) {
      setSelectedProduct(product);
      setPendingQuantity(quantity);
      setPendingUnit(unit);
      setPendingPrice(price);
      onOpen();
    } else {
      // Sinon, ajouter directement le produit sans prix
      addProductItem(product, quantity, unit, price);
    }
  };

  const handleCustomItemAdded = (itemData: {
    customName: string;
    quantity: number;
    unit: string;
    price?: number;
    isCompleted?: boolean;
  }) => {
    console.log("SmartQuickAddBar: Received custom item:", itemData);
    addCustomItem(itemData);
  };

  const handleModalConfirm = (data: {
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
    if (selectedProduct) {
      addProductItem(selectedProduct, data.quantity, data.unit, data.price);
    }
    onClose();
    setSelectedProduct(null);
  };

  return (
    <div className={className}>
      {/* Input simple avec liste déroulante */}
      <SmartItemInput
        listId={listId}
        onProductSelected={handleProductSelected}
        onItemAdded={handleCustomItemAdded}
        autoFocus
      />

      <ProductSelectionModal
        isOpen={isOpen}
        onClose={onClose}
        product={selectedProduct}
        defaultQuantity={pendingQuantity}
        defaultUnit={pendingUnit}
        defaultPrice={pendingPrice}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};
