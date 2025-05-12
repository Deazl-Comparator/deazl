"use client";

import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea
} from "@heroui/react";
import { CoinsIcon, SaveIcon, ShoppingBagIcon } from "lucide-react";
import { useState } from "react";
import type { ShoppingListItem } from "~/applications/ShoppingLists/Domain/Entities/ShoppingListItem";
import { UnitSchema } from "~/applications/ShoppingLists/Domain/Entities/ShoppingListItem";

export default function EditItemModal({
  isOpen,
  onClose,
  item,
  onUpdate
}: {
  isOpen: boolean;
  onClose: () => void;
  item: ShoppingListItem;
  onUpdate: (data: Partial<ShoppingListItem>) => Promise<void>;
}) {
  const [name, setName] = useState(item.customName || "");
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [unit, setUnit] = useState(item.unit);
  const [price, setPrice] = useState(item.price?.toString() || "");
  const [isCompleted, setIsCompleted] = useState(item.isCompleted);
  // @ts-ignore
  const [notes, setNotes] = useState(item.notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onUpdate({
        customName: name,
        quantity: Number.parseFloat(quantity),
        unit,
        price: price ? Number.parseFloat(price) : undefined,
        isCompleted,
        // @ts-ignore
        notes
      });
    } catch (error) {
      console.error("Error updating item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} classNames={{ backdrop: "backdrop-blur-sm" }}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBagIcon className="h-5 w-5 text-primary-600" />
            Edit Item
          </h3>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Item Name
              </label>
              <Input
                id="name"
                placeholder="e.g., Milk, Bread, etc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="quantity" className="text-sm font-medium">
                  Quantity
                </label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="0.01"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="unit" className="text-sm font-medium">
                  Unit
                </label>
                {/* @ts-ignore */}
                <Select className="w-full" selectedKeys={[unit]} onChange={(e) => setUnit(e.target.value)}>
                  {Object.values(UnitSchema.Values).map((unitValue) => (
                    // @ts-ignore
                    <SelectItem key={unitValue} value={unitValue}>
                      {unitValue}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium flex items-center gap-1">
                <CoinsIcon size={16} className="text-green-600" />
                Price (optional)
              </label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
                startContent={<span className="text-gray-500">€</span>}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes (optional)
              </label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            <div className="pt-2">
              <Checkbox isSelected={isCompleted} onValueChange={setIsCompleted}>
                Mark as completed
              </Checkbox>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="flat" onPress={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isSubmitting}
            startContent={<SaveIcon size={16} />}
            className="flex-1"
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
