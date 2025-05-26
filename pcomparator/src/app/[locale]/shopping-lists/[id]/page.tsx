import { notFound } from "next/navigation";
import { getShoppingList } from "~/ShoppingLists/Api/getShoppingList.api";
import { ShoppingListDetails } from "~/ShoppingLists/Ui/ShoppingListDetails/ShoppingListDetails";
import { auth } from "~/libraries/nextauth/authConfig";
import { GridBackground } from "~/views/Home/components/GridBackground";

export default async function ShoppingListPage({ params }: { params: Promise<{ id: string }> }) {
  const shoppingListId = (await params).id;
  const session = await auth();
  const list = await getShoppingList(shoppingListId);

  if (!list) notFound();

  return (
    <main className="relative -mt-[4rem] flex flex-1 w-full flex-col min-h-screen">
      <div className="absolute isolate overflow-hidden min-h-[calc(100dvh)] w-full flex items-center">
        <GridBackground />
      </div>
      <div className="max-w-3xl mx-auto w-full pb-8 pt-[4rem] px-4">
        {/* @ts-ignore */}
        <ShoppingListDetails list={list.toObject()} user={session?.user} />
      </div>
    </main>
  );
}
