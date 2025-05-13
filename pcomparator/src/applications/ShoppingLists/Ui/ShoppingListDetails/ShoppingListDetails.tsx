import type { ShoppingList } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList.entity";
import { ShoppingListContainer } from "~/applications/ShoppingLists/Ui/ShoppingListDetails/ShoppingListContainer";
import { ShoppingListDetailsHeader } from "~/applications/ShoppingLists/Ui/ShoppingListDetails/ShoppingListDetailsHeader";

interface ShoppingListDetailsProps {
  list: ShoppingList;
}

export const ShoppingListDetails = ({ list }: ShoppingListDetailsProps) => {
  return (
    <>
      <ShoppingListDetailsHeader shoppingListId={list.id} listName={list.name} />
      <ShoppingListContainer initialList={list.toObject()} />
    </>
  );
};
