"use client";

import { Button, Tooltip } from "@heroui/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export const ShoppingListButton = ({ floating = false }: { floating?: boolean }) => {
  if (floating) {
    return (
      <div className="fixed bottom-24 right-6 z-50">
        <Tooltip content="Create a new shopping list" placement="top">
          <Link href="/shopping-lists/create">
            <Button
              size="lg"
              color="primary"
              variant="solid"
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              <PlusIcon size={18} />
              New List
            </Button>
          </Link>
        </Tooltip>
      </div>
    );
  }

  return (
    <Link href="/shopping-lists/create">
      <Tooltip content="Create a new shopping list">
        <Button size="md" color="primary" variant="solid" startContent={<PlusIcon className="h-4 w-4" />}>
          New List
        </Button>
      </Tooltip>
    </Link>
  );
};
