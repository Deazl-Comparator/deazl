"use client";

import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { ShoppingCartIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteShoppingList } from "~/applications/ShoppingLists/Actions/shoppingListActions";
import type { ShoppingList } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList";

export default function ShoppingListsComponent({
  initialLists
}: {
  initialLists: ShoppingList[];
}) {
  const [lists, setLists] = useState(initialLists);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shopping list?")) {
      return;
    }

    await deleteShoppingList(id);
    setLists(lists.filter((list) => list.id !== id));
    router.refresh();
  };

  if (lists.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">No shopping lists yet</h3>
        <p className="mt-2 text-gray-500">Start by creating your first shopping list.</p>
        <Link href="/shopping-lists/create">
          <Button className="mt-4">Create Shopping List</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {lists.map((list) => (
        <Card key={list.id}>
          <CardHeader>
            <h3>{list.name}</h3>
            {list.description && <p>{list.description}</p>}
          </CardHeader>
          <CardBody>
            <p className="text-sm text-gray-500">
              {list.items?.length || 0} items • Created {new Date(list.createdAt!).toLocaleDateString()}
            </p>
          </CardBody>
          <CardFooter className="flex justify-between">
            <Link href={`/shopping-lists/${list.id}`}>
              {/* @ts-ignore */}
              <Button variant="outline">View Details</Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="ghost" size="md" onClick={() => handleDelete(list.id)}>
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
