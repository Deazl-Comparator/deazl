"use client";

import { Trans } from "@lingui/react/macro";
import { DatabaseIcon, SparklesIcon } from "lucide-react";
import { toast } from "react-toastify";
import { createProductFromItem } from "~/ShoppingLists/Api/createProductFromItem.api";
import type { ShoppingListItemPayload } from "~/ShoppingLists/Domain/Entities/ShoppingListItem.entity";

/**
 * 🚀 APPROCHE ULTRA-LÉGÈRE : Toast actionnable avec react-toastify
 * Plus discret qu'une modal, plus visible qu'une notification
 */
export const showSmartProductToast = async (
  item: ShoppingListItemPayload,
  selectedStore: { name: string; location: string } | null,
  onNeverAskAgain: (itemId: string) => void
) => {
  if (!selectedStore || !item.customName || !item.price) return;

  const handleSaveProduct = async () => {
    try {
      await createProductFromItem({
        name: item.customName!,
        price: item.price!,
        unit: item.unit,
        quantity: item.quantity,
        brandName: "Generic", // Smart default
        storeName: selectedStore.name,
        storeLocation: selectedStore.location,
        referencePrice: item.price!,
        referenceUnit: item.unit
      });

      // Toast de succès
      toast.success(
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-4 w-4 text-green-600" />
          <div>
            <div className="font-medium">
              <Trans>Product saved!</Trans>
            </div>
            <div className="text-sm text-gray-600">
              <Trans>"{item.customName}" added for price tracking</Trans>
            </div>
          </div>
        </div>,
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        }
      );
    } catch (error) {
      toast.error(
        <div>
          <div className="font-medium">
            <Trans>Error</Trans>
          </div>
          <div className="text-sm">
            <Trans>Failed to save product</Trans>
          </div>
        </div>,
        {
          position: "bottom-right",
          autoClose: 5000
        }
      );
    }
  };

  // 🎯 Toast avec action directe - ZÉRO modal
  toast(
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <DatabaseIcon className="h-5 w-5 text-blue-600" />
        <span className="font-medium text-gray-900">
          <Trans>Save for price tracking?</Trans>
        </span>
      </div>

      <div className="text-sm text-gray-600">
        <span className="font-medium">"{item.customName}"</span> • {item.price.toFixed(2)}€
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={handleSaveProduct}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          <Trans>Save</Trans>
        </button>
        <button
          type="button"
          onClick={() => {
            onNeverAskAgain(item.id);
            toast.dismiss();
          }}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
        >
          <Trans>Never ask</Trans>
        </button>
      </div>
    </div>,
    {
      position: "bottom-right",
      autoClose: 8000, // Plus long pour laisser le temps d'agir
      hideProgressBar: true,
      closeOnClick: false, // Éviter la fermeture accidentelle
      pauseOnHover: true,
      draggable: true,
      closeButton: true,
      className: "!bg-white !text-gray-900 shadow-lg border border-gray-200",
      bodyClassName: "!p-4",
      progressClassName: "!bg-blue-600"
    }
  );
};
