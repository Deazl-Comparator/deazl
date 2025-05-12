"use client";

import { Button, Tooltip } from "@heroui/react";
import { ArrowLeftIcon, ClipboardListIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const BackToList = () => {
  const router = useRouter();

  return (
    <div className="mb-6 flex items-center">
      <Tooltip content="Return to shopping lists">
        <Button
          variant="light"
          color="primary"
          size="sm"
          startContent={<ArrowLeftIcon className="h-4 w-4" />}
          endContent={<ClipboardListIcon className="h-4 w-4 ml-1" />}
          className="hover:shadow-sm transition-all"
          onClick={() => router.push("/shopping-lists")}
        >
          All Shopping Lists
        </Button>
      </Tooltip>
    </div>
  );
};
