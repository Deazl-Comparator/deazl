"use client";

import { Button } from "@heroui/react";
import { ClipboardListIcon, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";

export const ShoppingListEmpty = () => (
  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
    <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium">No shopping lists yet</h3>
    <p className="mt-2 text-gray-500">Start by creating your first shopping list.</p>
    <Link href="/shopping-lists/create">
      <Button className="mt-4" color="primary" startContent={<ClipboardListIcon size={16} />}>
        Create Shopping List
      </Button>
    </Link>
  </div>
);
