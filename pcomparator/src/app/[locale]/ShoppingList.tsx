"use client";

import { Button } from "@heroui/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export const ShoppingListButton = () => (
  <Link href="/shopping-lists/create">
    <Button size="sm">
      <PlusIcon className="h-4 w-4 mr-2" />
      New List
    </Button>
  </Link>
);
