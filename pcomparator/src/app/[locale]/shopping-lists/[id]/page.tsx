import { notFound } from "next/navigation";
import { getShoppingList } from "~/ShoppingLists/Api/shoppingLists/getShoppingList.api";
import { ShoppingListDetails } from "~/ShoppingLists/Ui/ShoppingListDetails/ShoppingListDetails";
import { auth } from "~/libraries/nextauth/authConfig";

export default async function ShoppingListPage({ params }: { params: Promise<{ id: string }> }) {
  const shoppingListId = (await params).id;
  const session = await auth();
  const list = await getShoppingList(shoppingListId);

  if (!list) notFound();

  return (
    <main className="flex w-full justify-center p-4">
      <div className="flex flex-col gap-y-8 max-w-4xl w-full">
        <div className="max-w-3xl mx-auto w-full pb-8">
          {/* @ts-ignore */}
          <ShoppingListDetails list={list.toObject()} user={session?.user} />
        </div>
      </div>
    </main>
  );
}
