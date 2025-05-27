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
  SelectItem
} from "@heroui/react";
import { Trans } from "@lingui/react/macro";
import { CoinsIcon, SaveIcon, ShoppingBagIcon } from "lucide-react";
import { useState } from "react";
import type { ShoppingListItemPayload } from "~/ShoppingLists/Domain/Entities/ShoppingListItem.entity";
import { UnitType } from "~/ShoppingLists/Domain/ValueObjects/Unit.vo";

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ShoppingListItemPayload;
  onUpdate: (data: Partial<ShoppingListItemPayload>) => Promise<void>;
}

export const EditItemModal = ({ isOpen, onClose, item, onUpdate }: EditItemModalProps) => {
  const [name, setName] = useState(item.customName || "");
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [unit, setUnit] = useState(item.unit);
  const [price, setPrice] = useState(item.price?.toString() || "");
  const [isCompleted, setIsCompleted] = useState(item.isCompleted);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    console.log("Submitting item update");
    try {
      await onUpdate({
        customName: name,
        quantity: Number.parseFloat(quantity),
        unit,
        price: price ? Number.parseFloat(price) : undefined,
        isCompleted
      });
    } catch (error) {
      console.error("Error updating item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} classNames={{ backdrop: "backdrop-blur-sm" }}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingBagIcon className="h-5 w-5 text-primary-600" />
              <Trans>Edit Item</Trans>
            </h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  <Trans>Item Name</Trans>
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
                    <Trans>Quantity</Trans>
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
                    <Trans>Unit</Trans>
                  </label>
                  <Select
                    className="w-full"
                    id="unit"
                    selectedKeys={[unit]}
                    onChange={(e: { target: { value: string } }) => setUnit(e.target.value as UnitType)}
                    aria-label="Select unit"
                  >
                    {Object.values(UnitType).map((unitValue) => (
                      <SelectItem key={unitValue} textValue={unitValue}>
                        {unitValue}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium flex items-center gap-1">
                  <CoinsIcon size={16} className="text-green-600" />
                  <Trans>Total Price</Trans>
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

              <div className="pt-2">
                <Checkbox isSelected={isCompleted} onValueChange={setIsCompleted}>
                  <Trans>Mark as completed</Trans>
                </Checkbox>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="flat" onPress={onClose} className="flex-1">
              <Trans>Cancel</Trans>
            </Button>
            <Button
              color="primary"
              onPress={handleSubmit}
              isLoading={isSubmitting}
              startContent={<SaveIcon size={16} />}
              className="flex-1"
            >
              <Trans>Save Changes</Trans>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
