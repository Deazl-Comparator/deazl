"use client";

import { Button } from "@heroui/react";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export const BackToList = () => (
  <div className="mb-6">
    <Link href="/shopping-lists">
      <Button variant="ghost" size="sm">
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to lists
      </Button>
    </Link>
  </div>
);
