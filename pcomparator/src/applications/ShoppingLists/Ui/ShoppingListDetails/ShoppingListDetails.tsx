import ShoppingListContainer from "~/app/[locale]/shopping-lists/components/ShoppingListContainer";
import type { ShoppingList } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList.entity";
import { ShoppingListDetailsHeader } from "~/applications/ShoppingLists/Ui/ShoppingListDetails/ShoppingListDetailsHeader";

interface ShoppingListDetailsProps {
  list: ShoppingList;
}

export const ShoppingListDetails = ({ list }: ShoppingListDetailsProps) => (
  <>
    <ShoppingListDetailsHeader shoppingListId={list.id} listName={list.name} />
    {/* @ts-ignore */}
    <ShoppingListContainer initialList={list.toObject()} />
  </>
);
