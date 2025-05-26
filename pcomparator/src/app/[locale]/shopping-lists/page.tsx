import { listUserShoppingList } from "~/ShoppingLists/Api/listUserShoppingList.api";
import { ShoppingListsView } from "~/ShoppingLists/Ui/ShoppingLists/ShoppingListsView";
import { withLinguiPage } from "~/core/withLinguiLayout";
import { GridBackground } from "~/views/Home/components/GridBackground";

export const metadata = {
  title: "Shopping Lists | PComparator",
  description: "Create and manage your shopping lists"
};

const ShoppingListsPage = async () => {
  const lists = await listUserShoppingList();

  return (
    <main className="relative -mt-[4rem] flex flex-1 w-full flex-col min-h-screen">
      <div className="absolute isolate overflow-hidden min-h-[calc(100dvh)] w-full flex items-center">
        <GridBackground />
      </div>
      <div className="relative z-10 pt-[4rem]">
        <ShoppingListsView lists={lists} />
      </div>
    </main>
  );
};

export default withLinguiPage(ShoppingListsPage);
