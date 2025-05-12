"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem
} from "@heroui/react";
import { useState } from "react";
import {
  type ShoppingListItem,
  UnitSchema
} from "~/applications/ShoppingLists/Domain/Entities/ShoppingListItem";

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
  const [unit, setUnit] = useState(item.unit || "unit");
  const [price, setPrice] = useState(item.price?.toString() || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const updatedData: Partial<ShoppingListItem> = {
        customName: name.trim() || item.customName,
        quantity: Number.parseFloat(quantity) || item.quantity,
        unit: unit || item.unit
      };

      // Ajouter le prix s'il est présent
      if (price && !Number.isNaN(Number.parseFloat(price))) {
        updatedData.price = Number.parseFloat(price);
      } else if (price === "") {
        // Si le champ est vide, définir explicitement à null pour supprimer le prix
        updatedData.price = null as any;
      }

      await onUpdate(updatedData);
      onClose();
    } catch (error) {
      console.error("Error updating item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Edit Item</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium mb-1">
                Item Name
              </label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Milk, Bread, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-quantity" className="block text-sm font-medium mb-1">
                  Quantity
                </label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="0.01"
                  step="0.01"
                />
              </div>

              <div>
                <label htmlFor="edit-unit" className="block text-sm font-medium mb-1">
                  Unit
                </label>
                <Select
                  id="edit-unit"
                  className="w-full"
                  selectedKeys={[unit]}
                  // @ts-ignore
                  onChange={(e) => setUnit(e.target.value || "unit")}
                >
                  {Object.values(UnitSchema.Values).map((unitValue) => (
                    // @ts-ignore
                    <SelectItem key={unitValue} value={unitValue}>
                      {unitValue}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="edit-price" className="block text-sm font-medium mb-1">
                Price (optional)
              </label>
              <Input
                id="edit-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
                placeholder="e.g., 2.99"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={isLoading}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
