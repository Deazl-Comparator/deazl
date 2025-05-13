"use client";

import type { ShoppingList } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList";
import { ShoppingListItemCard } from "~/applications/ShoppingLists/Ui/ShoppingListDetails/ShoppingListItemCard";
import { ShoppingListQuickAddBar } from "~/applications/ShoppingLists/Ui/ShoppingListDetails/ShoppingListQuickAddBar";
import { useShoppingListActions } from "~/applications/ShoppingLists/Ui/ShoppingListDetails/useShoppingListActions";

interface ShoppingListContainerProps {
  initialList: ShoppingList;
}

export const ShoppingListContainer = ({ initialList }: ShoppingListContainerProps) => {
  const { handleAddItem, handleDeleteItem, handleToggleComplete, handleUpdateItem, items } =
    useShoppingListActions(initialList);

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="flex flex-col gap-4">
        <ShoppingListQuickAddBar onItemAdded={handleAddItem} />
      </div>

      <ShoppingListItemCard
        list={{ ...initialList, items }}
        onToggleItem={handleToggleComplete}
        onDeleteItem={handleDeleteItem}
        onUpdateItem={handleUpdateItem}
      />
    </div>
  );
};
