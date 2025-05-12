import { notFound } from "next/navigation";
import ShoppingListPageHeader from "~/app/[locale]/shopping-lists/[id]/ShoppingListPageHeader";
import ShoppingListContainer from "~/app/[locale]/shopping-lists/components/ShoppingListContainer";
import { getShoppingList } from "~/applications/ShoppingLists/Actions/shoppingListActions";

export default async function ShoppingListPage({ params }: { params: Promise<{ id: string }> }) {
  const list = await getShoppingList((await params).id);

  if (!list) notFound();

  return (
    <main className="flex w-full justify-center p-4">
      <div className="flex flex-col gap-y-8 max-w-4xl w-full">
        <div className="max-w-3xl mx-auto w-full pb-8">
          <ShoppingListPageHeader listId={list.id} listName={list.name} />

          {/* Wrapper avec barre d'ajout rapide au-dessus de la liste */}
          <ShoppingListContainer initialList={list} />
        </div>
      </div>
    </main>
  );
}
