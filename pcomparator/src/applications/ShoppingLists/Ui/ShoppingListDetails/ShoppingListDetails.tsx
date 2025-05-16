"use client";

import {} from "~/app/[locale]/shopping-lists/[id]/action";
import type { ShoppingList } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList";
import { ShoppingListContainer } from "~/applications/ShoppingLists/Ui/ShoppingListDetails/ShoppingListContainer";
import { StoreProvider } from "../Contexts/StoreContext";

export const ShoppingListDetails = ({ list }: { list: ShoppingList }) => {
  return (
    <StoreProvider>
      <div className="space-y-4">
        <ShoppingListContainer initialList={list} />
      </div>
    </StoreProvider>
  );
};
