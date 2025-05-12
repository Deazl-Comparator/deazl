"use client";

import { Badge, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { CalendarIcon, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { shoppingListPageRoute } from "~/core/routes";

interface ShoppingListCardProps {
  shoppingListId: string;
  name: string;
  description?: string;
  createdAt?: Date;
  items?: {
    id: string;
    customName?: string;
    isCompleted: boolean;
  }[];
  progress: number;
  itemCount: number;
}

export const ShoppingListCard = ({
  shoppingListId,
  name,
  createdAt,
  description,
  items,
  progress,
  itemCount
}: ShoppingListCardProps) => (
  <Card
    key={shoppingListId}
    className="border border-gray-200 shadow-sm hover:shadow-md transition-all group"
    isPressable
    as={Link}
    href={shoppingListPageRoute(shoppingListId)}
  >
    <CardHeader className="pb-1">
      <div className="flex justify-between items-start w-full">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-primary-400 group-hover:text-primary-700">{name}</h3>
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
          <Badge content={itemCount} color="primary">
            <ShoppingCartIcon className="h-5 w-5 text-gray-500" />
          </Badge>
        </div>
      </div>
    </CardHeader>

    <CardBody className="py-3">
      {description ? (
        <p className="text-gray-600 text-sm mb-2">{description}</p>
      ) : (
        <p className="text-gray-400 text-sm italic mb-2">No description</p>
      )}

      <div className="flex items-center text-xs text-gray-500 mt-2">
        <CalendarIcon size={14} className="mr-1" />
        <span>Created {new Date(createdAt!).toLocaleDateString()}</span>
      </div>

      {itemCount > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Items:</p>
          <div className="flex flex-wrap gap-1">
            {items?.slice(0, 3).map((item) => (
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
