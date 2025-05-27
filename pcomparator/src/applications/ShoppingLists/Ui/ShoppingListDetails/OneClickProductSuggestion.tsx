"use client";

import { Button, Card, CardBody } from "@heroui/react";
import { Trans } from "@lingui/react/macro";
import { CheckCircleIcon, DatabaseIcon, SparklesIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { createProductFromItem } from "~/ShoppingLists/Api/createProductFromItem.api";
import type { ShoppingListItemPayload } from "~/ShoppingLists/Domain/Entities/ShoppingListItem.entity";
import { useStore } from "../Contexts/StoreContext";

interface OneClickProductSuggestionProps {
  item: ShoppingListItemPayload;
  isOpen: boolean;
  onClose: () => void;
  onNeverAskAgain: (itemId: string) => void;
}

export const OneClickProductSuggestion = ({
  item,
  isOpen,
  onClose,
  onNeverAskAgain
}: OneClickProductSuggestionProps) => {
  const { selectedStore } = useStore();
  const [isCreating, setIsCreating] = useState(false);

  // ✨ CRÉATION AUTOMATIQUE avec données smart par défaut
  const handleOneClickCreate = async () => {
    if (!selectedStore || !item.customName || !item.price) return;

    setIsCreating(true);
    try {
      // 🧠 Smart defaults - aucune friction
      await createProductFromItem({
        name: item.customName,
        price: item.price,
        unit: item.unit,
        quantity: item.quantity,
        brandName: "Generic", // Défaut smart
        storeName: selectedStore.name,
        storeLocation: selectedStore.location,
        referencePrice: item.price, // Prix actuel comme référence
        referenceUnit: item.unit // Unité actuelle
      });

      onClose();
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slideIn">
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 shadow-xl max-w-sm">
        <CardBody className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium text-gray-900">
                  <Trans>Save for price tracking?</Trans>
                </p>
              </div>

              <p className="text-xs text-gray-600 mb-3">
                <span className="font-medium">"{item.customName}"</span> • {item.price?.toFixed(2)}€
              </p>

              <div className="flex gap-2">
                {/* 🎯 BOUTON PRINCIPAL - 1 CLIC */}
                <Button
                  size="sm"
                  color="primary"
                  variant="solid"
                  startContent={<DatabaseIcon className="h-3 w-3" />}
                  onPress={handleOneClickCreate}
                  isLoading={isCreating}
                  isDisabled={!selectedStore}
                  className="flex-1 text-xs"
                >
                  <Trans>Save Product</Trans>
                </Button>

                {/* Actions secondaires minimales */}
                <Button size="sm" variant="light" onPress={onClose} className="text-xs px-2">
                  <Trans>Later</Trans>
                </Button>

                <Button
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={() => onNeverAskAgain(item.id)}
                  isIconOnly
                  className="text-xs w-8 h-8"
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </div>

              {!selectedStore && (
                <p className="text-xs text-amber-600 mt-2">
                  <Trans>Select a store to save products</Trans>
                </p>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
