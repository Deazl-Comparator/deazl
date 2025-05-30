"use client";

import type { ShoppingListPayload } from "../../Domain/Entities/ShoppingList.entity";
import { ShoppingListContainer } from "../../Ui/ShoppingListDetails/ShoppingListContainer";
import { ShoppingListDetailsHeader } from "../../Ui/ShoppingListDetails/ShoppingListDetailsHeader";
import { StoreProvider } from "../Contexts/StoreContext";

export const ShoppingListDetails = ({ list, user }: { list: ShoppingListPayload; user: any }) => {
  console.log(list);
  return (
    <StoreProvider>
      <div className="space-y-4">
        <ShoppingListDetailsHeader listName={list.name} shoppingListId={list.id} />
        <ShoppingListContainer initialList={list} user={{ id: user.id }} />
      </div>
    </StoreProvider>
  );
};
