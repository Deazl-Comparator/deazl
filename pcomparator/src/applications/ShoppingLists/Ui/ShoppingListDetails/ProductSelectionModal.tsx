"use client";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
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
import { MapPinIcon, PackageIcon, ShoppingCartIcon, TrendingUpIcon } from "lucide-react";
import { useState } from "react";
import { UnitType } from "~/ShoppingLists/Domain/ValueObjects/Unit.vo";
import { Currency, getCurrencySymbol } from "~/applications/Prices/Domain/ValueObjects/Currency";
import type { ProductSearchResult } from "~/applications/ShoppingLists/Api/searchProducts.api";

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductSearchResult | null;
  onConfirm: (selection: {
    productId: string;
    quantity: number;
    unit: string;
    price?: number;
    store?: {
      id: string;
      name: string;
      location: string;
    };
  }) => void;
}

export const ProductSelectionModal = ({
  isOpen,
  onClose,
  product,
  onConfirm
}: ProductSelectionModalProps) => {
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState<string>("unit");
  const [selectedPriceId, setSelectedPriceId] = useState<string>("");

  if (!product) return null;

  const handleConfirm = () => {
    const selectedPrice = product.prices.find((p) => p.id === selectedPriceId);
    const quantityValue = Number.parseFloat(quantity) || 1;
    const totalPrice = selectedPrice ? selectedPrice.amount * quantityValue : undefined;

    onConfirm({
      productId: product.id,
      quantity: quantityValue,
      unit,
      price: totalPrice,
      store: selectedPrice?.store
    });

    onClose();
  };

  const handleClose = () => {
    setQuantity("1");
    setUnit("unit");
    setSelectedPriceId("");
    onClose();
  };

  // Sélectionner automatiquement le meilleur prix
  const defaultPrice = product.bestPrice
    ? product.prices.find((p) => p.amount === product.bestPrice!.amount)
    : product.prices[0];

  if (defaultPrice && !selectedPriceId) {
    setSelectedPriceId(defaultPrice.id);
  }

  const selectedPrice = product.prices.find((p) => p.id === selectedPriceId);
  const currencySymbol = getCurrencySymbol((selectedPrice?.currency as Currency) || Currency.Euro);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      classNames={{
        body: "py-6"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3">
          <Avatar
            icon={<PackageIcon className="w-5 h-5" />}
            className="bg-primary-100 text-primary-600"
            size="sm"
          />
          <div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-500">
              <Trans>Add to shopping list</Trans>
            </p>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-4">
            {/* Informations du produit */}
            <Card>
              <CardBody className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUpIcon className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium">
                      <Trans>Price Information</Trans>
                    </span>
                  </div>
                  {product.averagePrice && (
                    <Chip size="sm" variant="flat" color="primary">
                      <Trans>
                        Avg: {currencySymbol}
                        {product.averagePrice}
                      </Trans>
                    </Chip>
                  )}
                </div>

                {/* Liste des prix disponibles */}
                <div className="space-y-2">
                  {product.prices.map((price) => (
                    <div
                      key={price.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPriceId === price.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedPriceId(price.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-sm">{price.store.name}</span>
                          </div>
                          <span className="text-xs text-gray-500">{price.store.location}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {getCurrencySymbol(price.currency as Currency)}
                            {price.amount}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(price.dateRecorded).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Divider />

            {/* Configuration de la quantité et unité */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={<Trans>Quantity</Trans>}
                placeholder="1"
                value={quantity}
                onValueChange={setQuantity}
                type="number"
                min="0.1"
                step="0.1"
                startContent={<ShoppingCartIcon className="w-4 h-4 text-gray-400" />}
              />

              <Select
                label={<Trans>Unit</Trans>}
                placeholder="Select unit"
                selectedKeys={[unit]}
                onSelectionChange={(keys) => setUnit(Array.from(keys)[0] as string)}
              >
                {Object.values(UnitType).map((unitOption) => (
                  <SelectItem key={unitOption}>{unitOption}</SelectItem>
                ))}
              </Select>
            </div>

            {/* Résumé de la sélection */}
            {selectedPrice && (
              <Card className="bg-success/5 border-success/20">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        <Trans>
                          {quantity} {unit} of {product.name}
                        </Trans>
                      </p>
                      <p className="text-sm text-gray-600">
                        <Trans>from {selectedPrice.store.name}</Trans>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-success">
                        {currencySymbol}
                        {(selectedPrice.amount * (Number.parseFloat(quantity) || 1)).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        <Trans>Total estimated cost</Trans>
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={handleClose}>
            <Trans>Cancel</Trans>
          </Button>
          <Button
            color="primary"
            onPress={handleConfirm}
            isDisabled={!selectedPrice || !quantity || Number.parseFloat(quantity) <= 0}
          >
            <Trans>Add to List</Trans>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
