"use client";

import {} from "~/app/[locale]/shopping-lists/[id]/action";
import type { ShoppingList } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList";
import { ShoppingListContainer } from "~/applications/ShoppingLists/Ui/ShoppingListDetails/ShoppingListContainer";
import { StoreProvider } from "../Contexts/StoreContext";
import { ShoppingListQuickAddBar } from "./ShoppingListQuickAddBar";

export const ShoppingListDetails = ({ list }: { list: ShoppingList }) => {
  return (
    <StoreProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <ShoppingListQuickAddBar listId={list.id} className="flex-1 min-w-[260px]" />
        </div>

        <ShoppingListContainer initialList={list} />
      </div>
    </StoreProvider>
  );
};
