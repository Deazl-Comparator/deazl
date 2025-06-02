"use client";

import { Button } from "@heroui/react";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShoppingListCreateForm, createShoppingList } from "~/packages/applications/shopping-lists/src";

async function handleCreateList(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const itemsJson = formData.get("items") as string;

  if (!name) {
    return { error: "Name is required" };
  }

  let items = [];
  if (itemsJson) {
    try {
      items = JSON.parse(itemsJson);
    } catch (error) {
      console.error("Error parsing items:", error);
    }
  }

  const list = await createShoppingList({
    name,
    description: description
  });

  redirect(`/shopping-lists/${list.id}`);
}

export default function CreateShoppingListPage() {
  return (
    <main className="flex w-full justify-center p-4 md:mt-8">
      <div className="flex flex-col gap-y-8 max-w-4xl w-[inherit]">
        <div className="container max-w-2xl mx-auto py-8">
          <div className="mb-6">
            <Link href="/shopping-lists">
              <Button variant="ghost" size="sm">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to lists
              </Button>
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-8">Create New Shopping List</h1>

          <ShoppingListCreateForm action={handleCreateList} />
        </div>
      </div>
    </main>
  );
}
