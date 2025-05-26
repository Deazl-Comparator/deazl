import {
  Button,
  Checkbox,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Tooltip,
  addToast
} from "@heroui/react";
import { Trans } from "@lingui/react/macro";
import {
  CoinsIcon,
  DatabaseIcon,
  InfoIcon,
  PlusCircleIcon,
  SaveIcon,
  ShoppingBagIcon,
  StoreIcon
} from "lucide-react";
import { useState } from "react";
import { createProductFromItem } from "~/ShoppingLists/Api/createProductFromItem.api";
import type { ShoppingListItemPayload } from "~/ShoppingLists/Domain/Entities/ShoppingListItem.entity";
import { UnitType } from "~/ShoppingLists/Domain/ValueObjects/Unit.vo";
import { useStore } from "../Contexts/StoreContext";
import { ProductDetailsModal } from "./ProductDetailsModal";

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ShoppingListItemPayload;
  onUpdate: (data: Partial<ShoppingListItemPayload>) => Promise<void>;
}

export const EditItemModal = ({ isOpen, onClose, item, onUpdate }: EditItemModalProps) => {
  const { selectedStore } = useStore();

  const [name, setName] = useState(item.customName || "");
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [unit, setUnit] = useState(item.unit);
  const [price, setPrice] = useState(item.price?.toString() || "");
  const [isCompleted, setIsCompleted] = useState(item.isCompleted);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [isProductDetailsModalOpen, setIsProductDetailsModalOpen] = useState(false);

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

  const handleCreateProduct = async ({
    brandName,
    referencePrice,
    referenceUnit
  }: { brandName: string; referencePrice: number; referenceUnit: string }) => {
    if (!name || !price) {
      addToast({
        title: <Trans>Missing information</Trans>,
        description: <Trans>Product name and price are required</Trans>,
        color: "warning",
        variant: "solid"
      });
      return;
    }

    if (!selectedStore) {
      addToast({
        title: <Trans>No store selected</Trans>,
        description: <Trans>Please select a store to associate with this product</Trans>,
        color: "warning",
        variant: "solid"
      });
      return;
    }

    setIsCreatingProduct(true);
    try {
      await createProductFromItem({
        name,
        price: Number.parseFloat(price || "0"),
        unit,
        quantity: Number.parseFloat(quantity),
        brandName,
        storeName: selectedStore.name,
        storeLocation: selectedStore.location,
        referencePrice,
        referenceUnit
      });

      addToast({
        title: <Trans>Product created</Trans>,
        description: <Trans>Product has been created and saved for future reference</Trans>,
        color: "success",
        variant: "solid"
      });

      // Fermer la modal des détails du produit
      setIsProductDetailsModalOpen(false);
    } catch (error) {
      console.error("Error creating product:", error);
      addToast({
        title: <Trans>Error</Trans>,
        description: <Trans>Failed to create product</Trans>,
        color: "danger",
        variant: "solid"
      });
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const openProductDetailsModal = () => {
    if (!name || !price) {
      addToast({
        title: <Trans>Missing information</Trans>,
        description: <Trans>Product name and price are required</Trans>,
        color: "warning",
        variant: "solid"
      });
      return;
    }

    if (!selectedStore) {
      addToast({
        title: <Trans>No store selected</Trans>,
        description: <Trans>Please select a store to associate with this product</Trans>,
        color: "warning",
        variant: "solid"
      });
      return;
    }

    setIsProductDetailsModalOpen(true);
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

              <Divider />

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <DatabaseIcon className="h-4 w-4 text-primary-600 mr-2" />
                  <h4 className="text-sm font-semibold">
                    <Trans>Save as Product</Trans>
                  </h4>
                </div>

                <p className="text-xs text-gray-600 mb-3">
                  <Trans>
                    Save this item as a product in your database to track prices and make smarter shopping
                    lists in the future.
                  </Trans>
                </p>

                {!name || !price || !selectedStore ? (
                  <div className="mb-3 p-2 bg-amber-50 rounded-md">
                    <div className="flex items-center mt-2 text-amber-600 gap-2 text-xs">
                      <InfoIcon size={14} className="mr-1 flex-[0_0_auto]" />
                      <span>
                        {!name || !price ? (
                          <Trans>Name and price are required to create a product</Trans>
                        ) : !selectedStore ? (
                          <Trans>
                            Please select a store from the dropdown at the top to associate with this product
                          </Trans>
                        ) : null}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3 p-2 bg-blue-50 rounded-md">
                    <p className="text-xs text-blue-700">
                      <StoreIcon className="inline-block h-3 w-3 mr-1" />
                      <Trans>
                        This product will be associated with <strong>{selectedStore.name}</strong> in{" "}
                        <strong>{selectedStore.location}</strong>
                      </Trans>
                    </p>
                  </div>
                )}

                <Tooltip
                  content={
                    <div className="p-2 max-w-xs">
                      <p className="text-xs">
                        <Trans>
                          This will create a new product in your database with the current name, price, and
                          quantity information. You can then track price changes over time and get
                          recommendations for the cheapest stores.
                        </Trans>
                      </p>
                    </div>
                  }
                >
                  <Button
                    color="primary"
                    variant="flat"
                    size="md"
                    startContent={<PlusCircleIcon size={16} />}
                    endContent={price ? <span className="text-xs ml-1">{price}€</span> : null}
                    fullWidth
                    onPress={openProductDetailsModal}
                    isDisabled={!name || !price || !selectedStore}
                  >
                    <Trans>Create Product</Trans>
                  </Button>
                </Tooltip>
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

      {/* Modal for product details */}
      <ProductDetailsModal
        isOpen={isProductDetailsModalOpen}
        onClose={() => setIsProductDetailsModalOpen(false)}
        onSubmit={handleCreateProduct}
        isLoading={isCreatingProduct}
        initialData={{
          productName: name,
          price: price ? Number.parseFloat(price) : undefined
        }}
      />
    </>
  );
};
