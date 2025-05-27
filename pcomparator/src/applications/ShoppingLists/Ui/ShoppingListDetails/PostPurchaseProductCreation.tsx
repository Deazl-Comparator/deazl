"use client";

import { Button, Card, CardBody, CardHeader, Chip, addToast } from "@heroui/react";
import { Trans } from "@lingui/react/macro";
import {
  CheckCircleIcon,
  DatabaseIcon,
  PackageIcon,
  PlusCircleIcon,
  SparklesIcon,
  StoreIcon
} from "lucide-react";
import { useState } from "react";
import { createProductFromItem } from "~/ShoppingLists/Api/createProductFromItem.api";
import type { ShoppingListItemPayload } from "~/ShoppingLists/Domain/Entities/ShoppingListItem.entity";
import { useStore } from "../Contexts/StoreContext";
import { ProductDetailsModal } from "./ProductDetailsModal";

interface PostPurchaseProductCreationProps {
  completedItems: ShoppingListItemPayload[];
  isVisible: boolean;
  onHide: () => void;
}

export const PostPurchaseProductCreation = ({
  completedItems,
  isVisible,
  onHide
}: PostPurchaseProductCreationProps) => {
  const { selectedStore } = useStore();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<ShoppingListItemPayload | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [createdProducts, setCreatedProducts] = useState<Set<string>>(new Set());

  // Filtrer les items qui ont un nom et un prix
  const eligibleItems = completedItems.filter(
    (item) => item.customName && item.price && !createdProducts.has(item.id)
  );

  if (!isVisible || eligibleItems.length === 0) {
    return null;
  }

  const handleSelectAll = () => {
    if (selectedItems.size === eligibleItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(eligibleItems.map((item) => item.id)));
    }
  };

  const handleToggleItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleCreateProduct = async (item: ShoppingListItemPayload) => {
    if (!selectedStore) {
      addToast({
        title: <Trans>No store selected</Trans>,
        description: <Trans>Please select a store to associate with this product</Trans>,
        color: "warning",
        variant: "solid"
      });
      return;
    }

    setCurrentItem(item);
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async ({
    brandName,
    referencePrice,
    referenceUnit
  }: { brandName: string; referencePrice: number; referenceUnit: string }) => {
    if (!currentItem || !selectedStore) return;

    setIsCreatingProduct(true);
    try {
      await createProductFromItem({
        name: currentItem.customName!,
        price: currentItem.price!,
        unit: currentItem.unit,
        quantity: currentItem.quantity,
        brandName,
        storeName: selectedStore.name,
        storeLocation: selectedStore.location,
        referencePrice,
        referenceUnit
      });

      // Marquer le produit comme créé
      setCreatedProducts((prev) => new Set([...prev, currentItem.id]));
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(currentItem.id);
        return newSet;
      });

      addToast({
        title: <Trans>Product created</Trans>,
        description: <Trans>Product "{currentItem.customName}" has been saved to your database</Trans>,
        color: "success",
        variant: "solid"
      });

      setIsProductModalOpen(false);
      setCurrentItem(null);
    } catch (error) {
      console.error("Error creating product:", error);
      addToast({
        title: <Trans>Error</Trans>,
        description: <Trans>Failed to create product</Trans>,
        color: "danger",
        variant: "solid"
      });
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const handleBulkCreate = async () => {
    if (!selectedStore || selectedItems.size === 0) return;

    setIsCreatingProduct(true);
    try {
      const selectedItemsList = eligibleItems.filter((item) => selectedItems.has(item.id));

      for (const item of selectedItemsList) {
        await createProductFromItem({
          name: item.customName!,
          price: item.price!,
          unit: item.unit,
          quantity: item.quantity,
          brandName: "", // Default brand name for bulk creation
          storeName: selectedStore.name,
          storeLocation: selectedStore.location,
          referencePrice: item.price!,
          referenceUnit: item.unit
        });

        setCreatedProducts((prev) => new Set([...prev, item.id]));
      }

      setSelectedItems(new Set());

      addToast({
        title: <Trans>Products created</Trans>,
        description: <Trans>{selectedItemsList.length} products have been saved to your database</Trans>,
        color: "success",
        variant: "solid"
      });
    } catch (error) {
      console.error("Error creating products:", error);
      addToast({
        title: <Trans>Error</Trans>,
        description: <Trans>Failed to create some products</Trans>,
        color: "danger",
        variant: "solid"
      });
    } finally {
      setIsCreatingProduct(false);
    }
  };

  return (
    <>
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <SparklesIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  <Trans>Shopping Complete! 🎉</Trans>
                </h3>
                <p className="text-sm text-gray-600">
                  <Trans>Save your purchases as products for future price tracking</Trans>
                </p>
              </div>
            </div>
            <Button size="sm" variant="light" onPress={onHide} className="text-gray-500 hover:text-gray-700">
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardBody className="pt-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DatabaseIcon className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  <Trans>{eligibleItems.length} items ready for product creation</Trans>
                </span>
              </div>

              {selectedStore ? (
                <Chip
                  size="sm"
                  variant="flat"
                  color="primary"
                  startContent={<StoreIcon className="h-3 w-3" />}
                >
                  {selectedStore.name}
                </Chip>
              ) : (
                <Chip size="sm" variant="flat" color="warning">
                  <Trans>No store selected</Trans>
                </Chip>
              )}
            </div>

            {!selectedStore && (
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-700">
                  <Trans>Please select a store from the dropdown above to enable product creation.</Trans>
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  <Trans>Select items to convert to products:</Trans>
                </span>
                <Button size="sm" variant="flat" onPress={handleSelectAll} isDisabled={!selectedStore}>
                  {selectedItems.size === eligibleItems.length ? (
                    <Trans>Deselect all</Trans>
                  ) : (
                    <Trans>Select all</Trans>
                  )}
                </Button>
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1">
                {eligibleItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${
                      selectedItems.has(item.id)
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                      onClick={() => selectedStore && handleToggleItem(item.id)}
                    >
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          selectedItems.has(item.id) ? "bg-blue-500 border-blue-500" : "border-gray-300"
                        }`}
                      >
                        {selectedItems.has(item.id) && <CheckCircleIcon className="h-3 w-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{item.customName}</span>
                          <span className="text-xs text-gray-500">
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                        <span className="text-sm text-green-600 font-medium">{item.price?.toFixed(2)}€</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      startContent={<PlusCircleIcon className="h-3 w-3" />}
                      onPress={() => handleCreateProduct(item)}
                      isDisabled={!selectedStore}
                    >
                      <Trans>Create</Trans>
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {selectedItems.size > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <Button
                  color="primary"
                  fullWidth
                  startContent={<PackageIcon className="h-4 w-4" />}
                  onPress={handleBulkCreate}
                  isLoading={isCreatingProduct}
                  isDisabled={!selectedStore}
                >
                  <Trans>Create {selectedItems.size} Products</Trans>
                </Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      <ProductDetailsModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSubmit={handleProductSubmit}
        isLoading={isCreatingProduct}
        initialData={{
          productName: currentItem?.customName || "",
          price: currentItem?.price
        }}
      />
    </>
  );
};
