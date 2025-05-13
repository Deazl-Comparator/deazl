import { Divider } from "@heroui/react";
import { Trans } from "@lingui/macro";
import { ClipboardListIcon } from "lucide-react";
import { listUserShoppingList } from "~/applications/ShoppingLists/Api/listUserShoppingList";
import { NewShoppingListButton } from "~/applications/ShoppingLists/Ui/NewShoppingListButton/NewShoppingListButton";
import { ShoppingList } from "~/applications/ShoppingLists/Ui/ShoppingList/ShoppingList";
import { withLinguiPage } from "~/core/withLinguiLayout";

export const metadata = {
  title: "Shopping Lists | PComparator",
  description: "Create and manage your shopping lists"
};

const ShoppingListsPage = async () => {
  const lists = await listUserShoppingList();

  return (
    <main className="flex w-full justify-center p-4">
      <div className="flex flex-col gap-y-8 max-w-4xl w-full">
        <div className="pb-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <ClipboardListIcon size={24} className="text-primary-400" />
              <h1 className="text-xl font-bold">
                <Trans>Your Shopping Lists</Trans>
              </h1>
            </div>
          </div>

          <Divider className="my-4" />

          <ShoppingList lists={lists} />
        </div>
      </div>
      <NewShoppingListButton />
    </main>
  );
};

export default withLinguiPage(ShoppingListsPage);
