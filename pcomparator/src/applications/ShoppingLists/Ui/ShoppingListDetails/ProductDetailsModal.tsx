import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Trans } from "@lingui/macro";
import { DatabaseIcon, SaveIcon, TagIcon } from "lucide-react";
import { useState } from "react";
import { useStore } from "../Contexts/StoreContext";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (brandName: string) => Promise<void>;
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
  const [brandName, setBrandName] = useState<string>();
  const { selectedStore } = useStore();

  const handleSubmit = async () => {
    await onSubmit(brandName!);
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
            isDisabled={!brandName || !selectedStore}
          >
            <Trans>Create Product</Trans>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
