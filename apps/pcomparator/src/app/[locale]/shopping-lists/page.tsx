import { withLinguiPage } from "~/core/withLinguiLayout";
import { ShoppingListsView, listUserShoppingList } from "~/packages/applications/shopping-lists/src";

export const metadata = {
  title: "Shopping Lists | PComparator",
  description: "Create and manage your shopping lists"
};

const ShoppingListsPage = async () => {
  const lists = await listUserShoppingList();

  return (
    <main className="flex w-full justify-center p-4">
      <div className="flex flex-col gap-y-8 max-w-4xl w-full">
        <div className="max-w-3xl mx-auto w-full pb-8">
          <ShoppingListsView lists={lists} />
        </div>
      </div>
    </main>
  );
};

export default withLinguiPage(ShoppingListsPage);
