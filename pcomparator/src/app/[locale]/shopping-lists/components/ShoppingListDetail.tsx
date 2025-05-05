"use client";

import { Button, Card, CardBody, CardHeader, Checkbox } from "@nextui-org/react";
import { ShoppingCartIcon, TrashIcon } from "lucide-react";
import type { ShoppingList } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList";

export default function ShoppingListDetail({
  list,
  onToggleItem,
  onDeleteItem
}: {
  list: ShoppingList;
  onToggleItem: (itemId: string, isCompleted: boolean) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
}) {
  const items = list.items || [];

  return (
    <Card>
      <CardHeader>
        {list.description && <p className="text-sm text-gray-500">{list.description}</p>}
      </CardHeader>
      <CardBody>
        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Your shopping list is empty</p>
            <p className="text-sm text-gray-400 mt-1">Add items using the "Add Item" button</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between p-2 border-b">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={item.isCompleted}
                    onCheckedChange={(checked) => onToggleItem(item.id, checked as boolean)}
                    id={`item-${item.id}`}
                  />
                  <label
                    htmlFor={`item-${item.id}`}
                    className={`${item.isCompleted ? "line-through text-gray-400" : ""}`}
                  >
                    {item.customName || `Product #${item.productId?.substring(0, 8) || "Unknown"}`}
                    <span className="ml-2 text-sm text-gray-500">
                      {item.quantity} {item.unit}
                    </span>
                  </label>
                </div>
                <Button
                  variant="light"
                  color="danger"
                  startContent={<TrashIcon className="h-4 w-4" />}
                  size="sm"
                  onClick={() => onDeleteItem(item.id)}
                  isIconOnly
                />
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
