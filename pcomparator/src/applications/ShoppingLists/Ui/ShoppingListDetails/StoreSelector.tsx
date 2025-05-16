"use client";

import { Autocomplete, AutocompleteItem, Button, Chip } from "@heroui/react";
import { Trans } from "@lingui/macro";
import { MapPinIcon, PlusIcon, SearchIcon, StoreIcon } from "lucide-react";
import { useState } from "react";
import { CollapsibleCard } from "~/components/CollapsibleCard/CollapsibleCard";
import { useStore } from "../Contexts/StoreContext";
import { useStoreData } from "../Hooks/useStoreData";
import { AddStoreModal } from "./AddStoreModal";

interface StoreGroup {
  label: string;
  stores: Array<{ id: string; name: string; location: string }>;
}

export const StoreSelector = () => {
  const { selectedStore, setSelectedStore, stores, isLoading } = useStore();
  useStoreData();

  const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);

  const handleAddNewStore = () => {
    setIsAddStoreModalOpen(true);
  };

  // Grouper les magasins par première lettre
  const groupedStores = stores
    .reduce<StoreGroup[]>((acc, store) => {
      const firstLetter = store.name[0].toUpperCase();
      const group = acc.find((g) => g.label === firstLetter);

      if (group) {
        group.stores.push(store);
      } else {
        acc.push({ label: firstLetter, stores: [store] });
      }

      return acc;
    }, [])
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <>
      <CollapsibleCard
        title={<Trans>Shopping at</Trans>}
        icon={<StoreIcon className="h-4 w-4 text-primary-500" />}
        summary={
          selectedStore ? (
            <div className="flex items-center gap-2">
              <span className="font-medium text-primary-600">{selectedStore.name}</span>
            </div>
          ) : (
            <span className="text-gray-400">
              <Trans>No store selected</Trans>
            </span>
          )
        }
      >
        <div className="flex items-center gap-2 flex-wrap flex-1 justify-end">
          <Autocomplete
            defaultItems={stores}
            selectedKey={selectedStore?.id}
            className="min-w-[250px] max-w-[350px]"
            onSelectionChange={(key) => {
              if (key === null) {
                setSelectedStore(null);
                return;
              }
              const store = stores.find((s) => s.id === key);
              if (store) setSelectedStore(store);
            }}
            allowsCustomValue={false}
            isLoading={isLoading}
            startContent={<SearchIcon className="text-default-400 h-4 w-4" />}
            endContent={
              !selectedStore && (
                <Button size="sm" color="primary" variant="light" onPress={handleAddNewStore} isIconOnly>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              )
            }
            inputProps={{
              classNames: {
                input: "text-sm",
                inputWrapper: "h-9 shadow-sm bg-white"
              }
            }}
            placeholder="Search stores..."
          >
            {(store) => (
              <AutocompleteItem key={store.id} textValue={`${store.name} ${store.location}`}>
                <div className="flex items-start gap-2 py-1">
                  <div className="h-6 w-6 rounded bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <StoreIcon className="h-3.5 w-3.5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{store.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPinIcon className="h-3 w-3" />
                      {store.location}
                    </p>
                  </div>
                </div>
              </AutocompleteItem>
            )}
          </Autocomplete>
        </div>
        {selectedStore && (
          <div className="mt-3 flex items-center gap-2">
            <Chip
              color="primary"
              variant="flat"
              size="sm"
              className="h-6"
              startContent={<MapPinIcon className="h-3 w-3" />}
            >
              {selectedStore.location}
            </Chip>
            <Button
              size="sm"
              variant="light"
              color="danger"
              className="h-6 min-w-0 px-2"
              onPress={() => setSelectedStore(null)}
            >
              <Trans>Clear</Trans>
            </Button>
          </div>
        )}
      </CollapsibleCard>

      <AddStoreModal isOpen={isAddStoreModalOpen} onClose={() => setIsAddStoreModalOpen(false)} />
    </>
  );
};
