"use client";

import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from "@heroui/react";
import { Trans } from "@lingui/macro";
import { ChevronDownIcon, MapPinIcon, PlusIcon, StoreIcon } from "lucide-react";
import { useState } from "react";
import { useStore } from "../Contexts/StoreContext";
import { useStoreData } from "../Hooks/useStoreData";
import { AddStoreModal } from "./AddStoreModal";

export const StoreSelector = () => {
  const { selectedStore, setSelectedStore, stores, isLoading } = useStore();
  // Utiliser le hook pour charger les données
  useStoreData();

  const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);

  const handleAddNewStore = () => {
    setIsAddStoreModalOpen(true);
  };

  return (
    <>
      <div className="bg-gray-50 rounded-lg border border-gray-100">
        <div className="py-2 px-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <StoreIcon className="h-4 w-4 text-primary-500" />
              <span>
                <Trans>Shopping at:</Trans>
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button
                    variant={selectedStore ? "flat" : "light"}
                    color={selectedStore ? "primary" : "default"}
                    className="h-8 px-3"
                    endContent={<ChevronDownIcon className="h-3.5 w-3.5" />}
                    size="sm"
                  >
                    {selectedStore ? (
                      <span className="font-medium">{selectedStore.name}</span>
                    ) : (
                      <span className="text-gray-600 text-sm">
                        <Trans>Select store</Trans>
                      </span>
                    )}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Store selection"
                  className="min-w-[220px] max-h-[400px] overflow-y-auto shadow-lg"
                  closeOnSelect
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Spinner size="sm" />
                      <span className="ml-2 text-sm">
                        <Trans>Loading...</Trans>
                      </span>
                    </div>
                  ) : (
                    <>
                      <DropdownItem
                        key="header"
                        className="font-semibold text-gray-500 bg-gray-50"
                        isReadOnly
                        showDivider
                      >
                        <Trans>Select a store</Trans>
                      </DropdownItem>

                      {selectedStore && (
                        <DropdownItem
                          key="clear"
                          className="text-danger font-medium"
                          startContent={<StoreIcon className="h-4 w-4" />}
                          onPress={() => setSelectedStore(null)}
                        >
                          <Trans>Clear selection</Trans>
                        </DropdownItem>
                      )}

                      {stores.map((store) => (
                        <DropdownItem
                          key={store.id}
                          startContent={<StoreIcon className="h-4 w-4" />}
                          onPress={() => setSelectedStore(store)}
                          className={
                            selectedStore?.id === store.id ? "bg-primary-50 text-primary-600 font-medium" : ""
                          }
                        >
                          <div>
                            <div>{store.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{store.location}</div>
                          </div>
                        </DropdownItem>
                      ))}

                      <DropdownItem
                        key="add-new"
                        startContent={<PlusIcon className="h-4 w-4" />}
                        className="text-primary-600 font-medium"
                        showDivider
                        onPress={handleAddNewStore}
                      >
                        <Trans>Add new store</Trans>
                      </DropdownItem>
                    </>
                  )}
                </DropdownMenu>
              </Dropdown>

              {selectedStore && (
                <Chip
                  color="primary"
                  variant="flat"
                  size="sm"
                  className="h-6 max-w-[300px]"
                  startContent={<MapPinIcon className="h-3 w-3 flex-shrink-0" />}
                >
                  <span className="text-xs truncate block max-w-full">{selectedStore.location}</span>
                </Chip>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddStoreModal isOpen={isAddStoreModalOpen} onClose={() => setIsAddStoreModalOpen(false)} />
    </>
  );
};
