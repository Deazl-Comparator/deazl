import { notFound } from "next/navigation";
import { BackToList } from "~/app/[locale]/shopping-lists/[id]/BackToList";
import ShoppingListContainer from "~/app/[locale]/shopping-lists/components/ShoppingListContainer";
import { getShoppingList } from "~/applications/ShoppingLists/Actions/shoppingListActions";

export default async function ShoppingListPage({ params }: { params: { id: string } }) {
  const list = await getShoppingList((await params).id);

  if (!list) {
    notFound();
  }

  return (
    <main className="flex w-full justify-center p-4 md:mt-8">
      <div className="flex flex-col gap-y-8 max-w-4xl w-[inherit]">
        <div className="container max-w-3xl mx-auto py-8">
          <BackToList />

          {/* Wrapper avec barre d'ajout rapide au-dessus de la liste */}
          <ShoppingListContainer initialList={list} />
        </div>
      </div>
    </main>
  );
}
