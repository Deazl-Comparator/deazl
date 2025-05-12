import { notFound } from "next/navigation";
import { getShoppingList } from "~/applications/ShoppingLists/Api/shoppingListActions";
import { ShoppingListDetails } from "~/applications/ShoppingLists/Ui/ShoppingListDetails/ShoppingListDetails";

export default async function ShoppingListPage({ params }: { params: Promise<{ id: string }> }) {
  const shoppingListId = (await params).id;
  const list = await getShoppingList(shoppingListId);

  if (!list) notFound();

  return (
    <main className="flex w-full justify-center p-4">
      <div className="flex flex-col gap-y-8 max-w-4xl w-full">
        <div className="max-w-3xl mx-auto w-full pb-8">
          <ShoppingListDetails list={list} />
        </div>
      </div>
    </main>
  );
}
