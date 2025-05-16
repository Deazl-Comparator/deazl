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
      <div className="flex items-center justify-between flex-wrap gap-2">
        <ShoppingListQuickAddBar
          listId={initialList.id}
          onItemAdded={handleAddItem}
          className="flex-1 min-w-[260px]"
        />
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
