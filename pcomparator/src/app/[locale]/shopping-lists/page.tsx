import { Suspense } from "react";
import { ShoppingListButton } from "~/app/[locale]/ShoppingList";
import ShoppingListsComponent from "~/app/[locale]/shopping-lists/components/ShoppingListsComponent";
import { getUserShoppingLists } from "~/applications/ShoppingLists/Actions/shoppingListActions";
import { withLinguiPage } from "~/core/withLinguiLayout";

export const metadata = {
  title: "Shopping Lists | PComparator",
  description: "Create and manage your shopping lists"
};

const ShoppingListsPage = async () => {
  const lists = await getUserShoppingLists();

  return (
    <main className="flex w-full justify-center p-4 md:mt-8">
      <div className="flex flex-col gap-y-8 max-w-4xl w-[inherit]">
        <div className="container max-w-4xl mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Your Shopping Lists</h1>
            <ShoppingListButton />
          </div>

          <Suspense fallback={<div>Loading shopping lists...</div>}>
            <ShoppingListsComponent initialLists={lists} />
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default withLinguiPage(ShoppingListsPage);
