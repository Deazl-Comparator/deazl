"use client";

import type { User } from "~/applications/Authentication/Domain/User";
import type { ShoppingListPayload } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList.entity";
import { ShoppingListContainer } from "~/applications/ShoppingLists/Ui/ShoppingListDetails/ShoppingListContainer";
import { ShoppingListDetailsHeader } from "~/applications/ShoppingLists/Ui/ShoppingListDetails/ShoppingListDetailsHeader";
import { StoreProvider } from "../Contexts/StoreContext";

export const ShoppingListDetails = ({ list, user }: { list: ShoppingListPayload; user: User }) => {
  return (
    <StoreProvider>
      <div className="space-y-4">
        <ShoppingListDetailsHeader listName={list.name} shoppingListId={list.id} />
        <ShoppingListContainer initialList={list} user={{ id: user.id }} />
      </div>
    </StoreProvider>
  );
};
