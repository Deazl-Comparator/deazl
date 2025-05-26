import { Button, Checkbox } from "@heroui/react";
import { CheckIcon, TrashIcon } from "lucide-react";
import { useCallback } from "react";
import type { ShoppingListItemPayload } from "~/applications/ShoppingLists/Domain/Entities/ShoppingListItem.entity";

interface ShoppingListItemListProps {
  items: ShoppingListItemPayload[];
  loading: Record<string, boolean>;
  handleToggleComplete: (itemId: string, isCompleted: boolean) => Promise<void>;
  onOpenEditModal: (item: ShoppingListItemPayload) => void;
  onDeleteItem: (itemId: string) => Promise<void>;
}

export const ShoppingListItemList = ({
  items,
  loading,
  handleToggleComplete,
  onOpenEditModal,
  onDeleteItem
}: ShoppingListItemListProps) => {
  // Utiliser useCallback pour éviter des re-rendus inutiles
  const onCheckboxClick = useCallback(
    (e: React.MouseEvent, itemId: string, isCompleted: boolean) => {
      e.stopPropagation(); // Empêcher le click de remonter jusqu'au <li>
      handleToggleComplete(itemId, isCompleted);
    },
    [handleToggleComplete]
  );

  return (
    <ul className="space-y-2 animate-fadeIn">
      {items.map((item) => (
        <li
          key={item.id}
          className={`flex items-center justify-between p-3 border rounded-md transition-colors cursor-pointer ${
            item.isCompleted ? "bg-gray-50 border-gray-200" : "hover:bg-primary-50 border-primary-100"
          }`}
          onClick={() => onOpenEditModal(item)}
        >
          <div className="flex items-center gap-3 flex-1">
            <div onClick={(e) => onCheckboxClick(e, item.id, item.isCompleted)}>
              <Checkbox
                isSelected={item.isCompleted}
                isDisabled={loading[item.id]}
                onValueChange={(isChecked) => handleToggleComplete(item.id, isChecked)}
                id={`item-${item.id}`}
                color="success"
                className="bg-transparent"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor={`item-${item.id}`}
                className={`${
                  item.isCompleted ? "line-through text-gray-400" : "font-medium"
                } cursor-pointer bg-transparent`}
              >
                {item.customName || `Product #${item.productId?.substring(0, 8) || "Unknown"}`}
              </label>
              <div className="flex items-center flex-wrap gap-2 text-sm text-gray-500">
                <span className="inline-flex items-center bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                  {item.quantity} {item.unit}
                </span>
                {item.price && (
                  <span className="font-medium text-green-600 inline-flex items-center bg-green-50 px-2 py-0.5 rounded-full text-xs">
                    {item.price.toFixed(2)}€
                  </span>
                )}
                {item.isCompleted && (
                  <span className="flex items-center text-green-600">
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
              onPress={() => onDeleteItem(item.id)}
              isIconOnly
              className="opacity-70 hover:opacity-100"
            />
          </div>
        </li>
      ))}
    </ul>
  );
};
