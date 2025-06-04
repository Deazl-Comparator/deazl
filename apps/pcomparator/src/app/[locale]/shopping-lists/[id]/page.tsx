import { notFound } from "next/navigation";
import { auth } from "~/libraries/nextauth/authConfig";
import { ShoppingListDetails, getShoppingList } from "~/packages/applications/shopping-lists/src";

export default async function ShoppingListPage({ params }: { params: Promise<{ id: string }> }) {
  const shoppingListId = (await params).id;
  const session = await auth();
  const list = await getShoppingList(shoppingListId);

  if (!list) notFound();

  return (
    <main className="flex w-full justify-center p-4">
      <div className="flex flex-col gap-y-8 max-w-4xl w-full">
        <div className="max-w-3xl mx-auto w-full pb-8">
          <ShoppingListDetails list={list.toObject()} user={session?.user} />
        </div>
      </div>
    </main>
  );
}
