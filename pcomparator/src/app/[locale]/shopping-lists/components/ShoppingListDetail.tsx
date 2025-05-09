"use client";

import { Button, Card, CardBody, CardHeader, Checkbox, Progress, useDisclosure } from "@heroui/react";
import { CheckIcon, ShoppingBagIcon, ShoppingCartIcon, TrashIcon } from "lucide-react";
import { useMemo, useState } from "react";
import type { ShoppingList } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList";
import type { ShoppingListItem } from "~/applications/ShoppingLists/Domain/Entities/ShoppingListItem";
import EditItemModal from "./EditItemModal";

export default function ShoppingListDetail({
  list,
  onToggleItem,
  onDeleteItem,
  onUpdateItem
}: {
  list: ShoppingList;
  onToggleItem: (itemId: string, isCompleted: boolean) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
  onUpdateItem: (itemId: string, data: Partial<ShoppingListItem>) => Promise<void>;
}) {
  const items = list.items || [];
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<ShoppingListItem | null>(null);

  // Calculer les statistiques de la liste
  const stats = useMemo(() => {
    const total = items.length;
    const checked = items.filter((item) => item.isCompleted).length;
    const unchecked = total - checked;
    const progress = total > 0 ? Math.round((checked / total) * 100) : 0;

    // Calculer le montant total et le montant des produits cochés
    let totalAmount = 0;
    let checkedAmount = 0;
    let uncheckedAmount = 0;

    for (const item of items) {
      if (item.price) {
        totalAmount += item.price;
        if (item.isCompleted) {
          checkedAmount += item.price;
        } else {
          uncheckedAmount += item.price;
        }
      }
    }

    return {
      total,
      checked,
      unchecked,
      progress,
      totalAmount,
      checkedAmount,
      uncheckedAmount,
      hasPrices: totalAmount > 0
    };
  }, [items]);

  // Gérer le changement d'état d'une checkbox
  const handleToggleComplete = async (itemId: string, isCompleted: boolean) => {
    try {
      // Marquer cet item comme en cours de mise à jour
      setLoading((prev) => ({ ...prev, [itemId]: true }));

      // Appeler la fonction de mise à jour fournie par le parent
      await onToggleItem(itemId, isCompleted);
    } catch (error) {
      console.error("Error toggling item completion:", error);
    } finally {
      // Marquer la fin du chargement quel que soit le résultat
      setLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleOpenEditModal = (item: ShoppingListItem) => {
    setSelectedItem(item);
    onOpen();
  };

  const handleUpdateItem = async (data: Partial<ShoppingListItem>) => {
    if (!selectedItem) return;
    await onUpdateItem(selectedItem.id, data);
    onClose();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 w-full">
            {list.description && <p className="text-sm text-gray-500">{list.description}</p>}

            {/* Résumé et progression avec design amélioré */}
            <div className="mt-2 pb-2 w-full">
              {/* Section de progression */}
              <div className="bg-gray-50 p-4 rounded-lg mb-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <ShoppingCartIcon size={18} className="text-blue-600" />
                    <span className="font-medium">Shopping Progress</span>
                  </div>
                  <div className="text-sm font-medium">{stats.progress}%</div>
                </div>

                <Progress
                  value={stats.progress}
                  color="success"
                  size="md"
                  showValueLabel={false}
                  className="mb-2"
                />

                <div className="grid grid-cols-3 gap-2 text-sm mt-3">
                  <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm">
                    <span className="text-gray-500">Remaining</span>
                    <span className="text-lg font-bold text-blue-600">{stats.unchecked}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm">
                    <span className="text-gray-500">Completed</span>
                    <span className="text-lg font-bold text-green-600">{stats.checked}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm">
                    <span className="text-gray-500">Total</span>
                    <span className="text-lg font-bold">{stats.total}</span>
                  </div>
                </div>
              </div>

              {/* Section du prix si disponible */}
              {stats.hasPrices && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <ShoppingBagIcon size={18} className="text-green-600" />
                      <span className="font-medium">Price Summary</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm">
                      <span className="text-gray-500">To Buy</span>
                      <span className="text-lg font-bold text-blue-600">
                        {stats.uncheckedAmount.toFixed(2)}€
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm">
                      <span className="text-gray-500">Purchased</span>
                      <span className="text-lg font-bold text-green-600">
                        {stats.checkedAmount.toFixed(2)}€
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm">
                      <span className="text-gray-500">Total</span>
                      <span className="text-lg font-bold text-green-700">
                        {stats.totalAmount.toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Your shopping list is empty</p>
              <p className="text-sm text-gray-400 mt-1">Add items using the input above</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleOpenEditModal(item)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox
                      isSelected={item.isCompleted}
                      isDisabled={loading[item.id]}
                      onValueChange={(isChecked) => {
                        handleToggleComplete(item.id, isChecked);
                      }}
                      id={`item-${item.id}`}
                      color="success"
                      // Important: Arrêter la propagation pour éviter d'ouvrir le modal
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex flex-col">
                      <label
                        htmlFor={`item-${item.id}`}
                        className={`${item.isCompleted ? "line-through text-gray-400" : "font-medium"} cursor-pointer`}
                        onClick={(e) => e.stopPropagation()} // Éviter de déclencher le modal
                      >
                        {item.customName || `Product #${item.productId?.substring(0, 8) || "Unknown"}`}
                      </label>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>
                          {item.quantity} {item.unit}
                        </span>
                        {item.price && (
                          <span className="font-medium text-green-600 ml-2 flex items-center">
                            {item.price.toFixed(2)}€
                          </span>
                        )}
                        {item.isCompleted && (
                          <span className="flex items-center text-green-600 ml-2">
                            <CheckIcon size={14} className="mr-1" />
                            <span className="text-xs">Completed</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="light"
                      color="danger"
                      startContent={<TrashIcon className="h-4 w-4" />}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      isIconOnly
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      {/* Modal pour éditer un item */}
      {selectedItem && (
        <EditItemModal isOpen={isOpen} onClose={onClose} item={selectedItem} onUpdate={handleUpdateItem} />
      )}
    </>
  );
}
