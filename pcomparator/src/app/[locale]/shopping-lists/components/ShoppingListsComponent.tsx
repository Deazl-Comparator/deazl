"use client";

import { Badge, Button, Card, CardBody, CardHeader, Chip, Tooltip } from "@heroui/react";
import { CalendarIcon, ClipboardListIcon, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ShoppingList } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList";

export default function ShoppingListsComponent({
  initialLists
}: {
  initialLists: ShoppingList[];
}) {
  const [lists, setLists] = useState(initialLists);
  const router = useRouter();

  if (lists.length === 0) {
    return (
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
  }

  return (
    <div className="space-y-6 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lists.map((list) => {
          const itemCount = list.items?.length || 0;
          const completedCount = list.items?.filter((item) => item.isCompleted).length || 0;
          const progress = itemCount > 0 ? Math.round((completedCount / itemCount) * 100) : 0;

          return (
            <Card
              key={list.id}
              className="border border-gray-200 shadow-sm hover:shadow-md transition-all group"
              isPressable
              as={Link}
              href={`/shopping-lists/${list.id}`}
            >
              <CardHeader className="pb-1">
                <div className="flex justify-between items-start w-full">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-primary-400 group-hover:text-primary-700">
                      {list.name}
                    </h3>
                    {progress > 0 && (
                      <Chip
                        color={progress === 100 ? "success" : progress > 50 ? "warning" : "primary"}
                        variant="flat"
                        size="sm"
                        className="mt-1 max-w-max"
                      >
                        {progress}% complete
                      </Chip>
                    )}
                  </div>
                  <div className="flex-shrink-0 ml-auto p-3">
                    <Tooltip content={`${completedCount}/${itemCount} items completed`}>
                      <Badge content={itemCount} color="primary">
                        <ShoppingCartIcon className="h-5 w-5 text-gray-500" />
                      </Badge>
                    </Tooltip>
                  </div>
                </div>
              </CardHeader>

              <CardBody className="py-3">
                {list.description ? (
                  <p className="text-gray-600 text-sm mb-2">{list.description}</p>
                ) : (
                  <p className="text-gray-400 text-sm italic mb-2">No description</p>
                )}

                <div className="flex items-center text-xs text-gray-500 mt-2">
                  <CalendarIcon size={14} className="mr-1" />
                  <span>Created {new Date(list.createdAt!).toLocaleDateString()}</span>
                </div>

                {/* Preview des items si disponibles */}
                {itemCount > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Items:</p>
                    <div className="flex flex-wrap gap-1">
                      {list.items?.slice(0, 3).map((item) => (
                        <Chip
                          key={item.id}
                          size="sm"
                          variant="flat"
                          color={item.isCompleted ? "success" : "default"}
                          className="text-xs"
                        >
                          {item.customName || `Item #${item.id.substring(0, 4)}`}
                        </Chip>
                      ))}
                      {itemCount > 3 && (
                        <Chip size="sm" variant="flat" color="primary" className="text-xs">
                          +{itemCount - 3} more
                        </Chip>
                      )}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
