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
import { Trans } from "@lingui/macro";
import { DatabaseIcon, SaveIcon, TagIcon } from "lucide-react";
import { useState } from "react";
import { useStore } from "../Contexts/StoreContext";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productDetails: {
    brandName: string;
    referencePrice: number;
    referenceUnit: string;
  }) => Promise<void>;
  isLoading: boolean;
  initialData: {
    productName?: string;
    price?: number;
  };
}

export const ProductDetailsModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData
}: ProductDetailsModalProps) => {
  const [brandName, setBrandName] = useState<string>("");
  const [referencePrice, setReferencePrice] = useState<string>("");
  const [referenceUnit, setReferenceUnit] = useState<string>("kg");
  const { selectedStore } = useStore();

  const handleSubmit = async () => {
    if (!brandName || !referencePrice) {
      return;
    }
    await onSubmit({
      brandName,
      referencePrice: Number.parseFloat(referencePrice),
      referenceUnit
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} classNames={{ backdrop: "backdrop-blur-sm" }}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <DatabaseIcon className="h-5 w-5 text-primary-600" />
            <Trans>Product Details</Trans>
          </h3>
          {initialData.productName && (
            <div className="mt-1 text-sm text-gray-500">
              <span className="font-medium text-primary-600">{initialData.productName}</span>
              {initialData.price && (
                <span className="ml-2 text-green-600">{initialData.price.toFixed(2)}€</span>
              )}
            </div>
          )}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              <Trans>
                Please provide additional details about this product to help with future price comparisons.
              </Trans>
            </p>

            <div className="space-y-2">
              <label htmlFor="brandName" className="text-sm font-medium flex items-center gap-1">
                <TagIcon size={16} className="text-blue-600" />
                <Trans>Brand</Trans>
              </label>
              <Input
                id="brandName"
                placeholder="e.g., Generic, Nestlé, etc."
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="referencePrice" className="text-sm font-medium">
                  <Trans>Reference Price</Trans>
                </label>
                <Input
                  id="referencePrice"
                  type="number"
                  placeholder="Enter price per kg/unit"
                  value={referencePrice}
                  onChange={(e) => setReferencePrice(e.target.value)}
                  min="0"
                  step="0.01"
                  startContent={<span className="text-gray-500">€</span>}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="referenceUnit" className="text-sm font-medium">
                  <Trans>Reference Unit</Trans>
                </label>
                <Select
                  className="w-full"
                  id="referenceUnit"
                  selectedKeys={[referenceUnit]}
                  onChange={(e: { target: { value: string } }) => setReferenceUnit(e.target.value)}
                  aria-label="Select reference unit"
                >
                  {["kg", "L", "unit"].map((unitValue) => (
                    <SelectItem key={unitValue} textValue={unitValue}>
                      {unitValue}
                    </SelectItem>
                  ))}
                </Select>
              </div>
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
            isLoading={isLoading}
            startContent={<SaveIcon size={16} />}
            className="flex-1"
            isDisabled={!brandName || !referencePrice || !selectedStore}
          >
            <Trans>Create Product</Trans>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
