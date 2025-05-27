"use client";

import { Button, Card, CardBody, Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { Trans } from "@lingui/react/macro";
import { CheckCircleIcon, DatabaseIcon, PlusCircleIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { createProductFromItem } from "~/ShoppingLists/Api/createProductFromItem.api";
import type { ShoppingListItemPayload } from "~/ShoppingLists/Domain/Entities/ShoppingListItem.entity";
import { useStore } from "../Contexts/StoreContext";
import { ProductDetailsModal } from "./ProductDetailsModal";

interface ImmediateProductSuggestionProps {
  item: ShoppingListItemPayload;
  isOpen: boolean;
  onCloseAction: () => void;
  onNeverAskAgainAction: (itemId: string) => void;
}

export const ImmediateProductSuggestion = ({
  item,
  isOpen,
  onCloseAction,
  onNeverAskAgainAction
}: ImmediateProductSuggestionProps) => {
  const { selectedStore } = useStore();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProduct = () => {
    if (!selectedStore) {
      // TODO: Add toast notification
      return;
    }
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async ({
    brandName,
    referencePrice,
    referenceUnit
  }: { brandName: string; referencePrice: number; referenceUnit: string }) => {
    if (!selectedStore) return;

    setIsCreating(true);
    try {
      await createProductFromItem({
        name: item.customName!,
        price: item.price!,
        unit: item.unit,
        quantity: item.quantity,
        brandName,
        storeName: selectedStore.name,
        storeLocation: selectedStore.location,
        referencePrice,
        referenceUnit
      });

      setIsProductModalOpen(false);
      onCloseAction();
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleNeverAskAgain = () => {
    onNeverAskAgainAction(item.id);
    onCloseAction();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onCloseAction}
        size="sm"
        placement="bottom-center"
        classNames={{
          backdrop: "backdrop-blur-sm",
          base: "mx-4 mb-4"
        }}
      >
        <ModalContent>
          <ModalHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">
                <Trans>Item checked!</Trans>
              </h3>
            </div>
          </ModalHeader>
          <ModalBody className="pb-4">
            <Card className="bg-blue-50 border border-blue-200">
              <CardBody className="p-3">
                <div className="flex items-center gap-3 mb-3">
                  <DatabaseIcon className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      <Trans>Save "{item.customName}" as a product?</Trans>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      <Trans>Track prices and get recommendations for future shopping</Trans>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                  <span>
                    {item.quantity} {item.unit}
                  </span>
                  <span className="font-medium text-green-600">{item.price?.toFixed(2)}€</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    startContent={<PlusCircleIcon className="h-3 w-3" />}
                    onPress={handleCreateProduct}
                    isDisabled={!selectedStore}
                    className="text-xs"
                  >
                    <Trans>Yes</Trans>
                  </Button>
                  <Button size="sm" variant="flat" onPress={onCloseAction} className="text-xs">
                    <Trans>Later</Trans>
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    startContent={<XIcon className="h-3 w-3" />}
                    onPress={handleNeverAskAgain}
                    className="text-xs"
                  >
                    <Trans>Never</Trans>
                  </Button>
                </div>

                {!selectedStore && (
                  <p className="text-xs text-amber-600 mt-2 text-center">
                    <Trans>Please select a store first</Trans>
                  </p>
                )}
              </CardBody>
            </Card>
          </ModalBody>
        </ModalContent>
      </Modal>

      <ProductDetailsModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSubmit={handleProductSubmit}
        isLoading={isCreating}
        initialData={{
          productName: item.customName || "",
          price: item.price
        }}
      />
    </>
  );
};
