import { Divider } from "@heroui/react";
import { ClipboardListIcon } from "lucide-react";
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

  console.log(lists);
  return (
    <main className="flex w-full justify-center p-4">
      <div className="flex flex-col gap-y-8 max-w-4xl w-full">
        <div className="pb-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <ClipboardListIcon size={24} className="text-primary-400" />
              <h1 className="text-xl font-bold">Your Shopping Lists</h1>
            </div>
          </div>

          <Divider className="my-4" />

          <Suspense
            fallback={
              <div className="py-8 text-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-12 w-12 bg-gray-200 rounded-full mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-48 mb-2.5" />
                  <div className="h-3 bg-gray-200 rounded w-32" />
                </div>
              </div>
            }
          >
            <ShoppingListsComponent initialLists={lists} />
          </Suspense>
        </div>
      </div>
      <ShoppingListButton floating />
    </main>
  );
};

export default withLinguiPage(ShoppingListsPage);
