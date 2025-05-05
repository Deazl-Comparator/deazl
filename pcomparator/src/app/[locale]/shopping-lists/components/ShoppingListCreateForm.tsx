"use client";

import { Button, Card, CardBody, CardFooter, Chip, Select, SelectItem, Textarea } from "@nextui-org/react";
import { PlusIcon, XIcon } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import { UnitSchema } from "~/applications/ShoppingLists/Domain/Entities/ShoppingListItem";
import useForm from "~/components/Form/useForm";
import { Input } from "~/components/Inputs/Input/Input";

type ItemType = {
  id: string;
  customName: string;
  quantity: number;
  unit: string;
};

export default function ShoppingListCreateForm({
  action
}: {
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}) {
  const form = useForm<{ name: string }>(undefined);
  const [items, setItems] = useState<ItemType[]>([]);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("unit");
  const [isAddingItem, setIsAddingItem] = useState(false);

  const handleAddItem = () => {
    if (!itemName.trim()) return;

    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        customName: itemName,
        quantity: Number.parseFloat(quantity),
        unit
      }
    ]);

    // Reset inputs
    setItemName("");
    setQuantity("1");
    setUnit("unit");

    // Focus back on the item name input
    const nameInput = document.getElementById("itemName");
    if (nameInput) nameInput.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem();
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const toggleAddItem = () => {
    setIsAddingItem(!isAddingItem);
    if (!isAddingItem) {
      // Focus on the item name input when we show the item form
      setTimeout(() => {
        const nameInput = document.getElementById("itemName");
        if (nameInput) nameInput.focus();
      }, 100);
    }
  };

  return (
    <Card>
      <form.Form
        methods={form.methods}
        onSubmit={(data) => {
          const formData = new FormData();
          formData.append("name", data.name);
          formData.append("description", data.description || "");

          // Add items to form data
          formData.append("items", JSON.stringify(items));

          action(formData);
        }}
      >
        <CardBody className="pt-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="name">List Name</label>
            <Input id="name" name="name" placeholder="e.g., Weekly Groceries" isRequired />
          </div>

          <div className="space-y-2">
            <label htmlFor="description">Description (optional)</label>
            <Textarea
              id="description"
              name="description"
              placeholder="Add details about this shopping list"
              rows={3}
            />
          </div>

          {/* Items section */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Items</h3>
              <Button
                size="sm"
                color={isAddingItem ? "danger" : "primary"}
                variant={isAddingItem ? "flat" : "solid"}
                onClick={toggleAddItem}
              >
                {isAddingItem ? (
                  <>
                    <XIcon size={16} />
                    <span className="ml-1">Cancel</span>
                  </>
                ) : (
                  <>
                    <PlusIcon size={16} />
                    <span className="ml-1">Add Item</span>
                  </>
                )}
              </Button>
            </div>

            {/* Item list display */}
            {items.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {items.map((item) => (
                  <Chip key={item.id} onClose={() => removeItem(item.id)} color="primary" variant="flat">
                    {item.customName} ({item.quantity} {item.unit})
                  </Chip>
                ))}
              </div>
            )}

            {/* Add item form */}
            {isAddingItem && (
              <div className="p-4 bg-gray-50 rounded-md space-y-4">
                <div className="space-y-2">
                  <label htmlFor="itemName">Item Name</label>
                  <Input
                    id="itemName"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g., Milk, Bread, etc."
                    isRequired
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="quantity">Quantity</label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="0.01"
                      step="0.01"
                      isRequired
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="unit">Unit</label>
                    <Select
                      id="unit"
                      className="w-full"
                      selectedKeys={[unit]}
                      onChange={(e) => setUnit(e.target.value)}
                    >
                      {Object.values(UnitSchema.Values).map((unitValue) => (
                        <SelectItem key={unitValue} value={unitValue}>
                          {unitValue}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    size="sm"
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddItem();
                    }}
                  >
                    Add to List
                  </Button>
                </div>
              </div>
            )}

            {/* Empty state for items */}
            {items.length === 0 && !isAddingItem && (
              <div className="text-center p-8 bg-gray-50 rounded-md">
                <p className="text-gray-500">No items added yet</p>
                <Button size="sm" variant="flat" color="primary" className="mt-2" onClick={toggleAddItem}>
                  <PlusIcon size={16} className="mr-1" />
                  Add First Item
                </Button>
              </div>
            )}
          </div>
        </CardBody>

        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            color="primary"
            isDisabled={form.methods.formState.isSubmitting}
          >
            Create Shopping List
          </Button>
        </CardFooter>
      </form.Form>
    </Card>
  );
}
