import { Button, Card, CardBody, CardHeader, useDisclosure } from "@heroui/react";
import { FilterIcon, InfoIcon, ShoppingCartIcon } from "lucide-react";
import type { ShoppingListPayload } from "~/ShoppingLists/Domain/Entities/ShoppingList.entity";
import type { ShoppingListItemPayload } from "~/ShoppingLists/Domain/Entities/ShoppingListItem.entity";
import { EditItemModal } from "~/ShoppingLists/Ui/ShoppingListDetails/EditItemModal";
import { StoreSelector } from "~/ShoppingLists/Ui/ShoppingListDetails/StoreSelector";
import { ShoppingListFilter } from "./ShoppingListFilter";
import { ShoppingListItemList } from "./ShoppingListItemList";
import { ShoppingListStats } from "./ShoppingListStats";
import { useShoppingListItems } from "./useShoppingListItems";

export const ShoppingListItemCard = ({
  list,
  onToggleItem,
  onDeleteItem,
  onUpdateItem
}: {
  list: ShoppingListPayload;
  onToggleItem: (itemId: string, isCompleted: boolean) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
  onUpdateItem: (itemId: string, data: Partial<ShoppingListItemPayload>) => Promise<void>;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    stats,
    completedItems,
    filteredItems,
    loading,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    sortDirection,
    selectedItem,
    setSelectedItem,
    handleToggleComplete,
    toggleSortDirection
  } = useShoppingListItems(list);

  const handleOpenEditModal = (item: ShoppingListItemPayload) => {
    setSelectedItem(item);
    onOpen();
  };

  const handleUpdateItem = async (data: Partial<ShoppingListItemPayload>) => {
    if (!selectedItem) return;

    await onUpdateItem(selectedItem.id, data);
    onClose();
  };

  const handleItemToggle = async (itemId: string, isCompleted: boolean) => {
    await handleToggleComplete(itemId, isCompleted, onToggleItem);
  };

  return (
    <>
      <Card className="shadow-sm border border-gray-100 hover:border-gray-200 transition-colors">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-2 w-full">
            <StoreSelector />

            {list.description && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <InfoIcon size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-700">{list.description}</p>
                  {stats.total > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      {stats.checked} of {stats.total} items completed
                      {stats.hasPrices && ` • Total: ${stats.totalAmount.toFixed(2)}€`}
                    </p>
                  )}
                </div>
              </div>
            )}

            <ShoppingListStats stats={stats} completedItems={completedItems} />
          </div>
        </CardHeader>

        <CardBody>
          {list.items?.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 font-medium">Your shopping list is empty</p>
              <p className="text-sm text-gray-400 mt-1">Add items using the quick add bar above</p>
            </div>
          ) : (
            <div className="space-y-4">
              <ShoppingListFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filter={filter}
                setFilter={setFilter}
                sortBy={sortBy}
                sortDirection={sortDirection}
                toggleSortDirection={toggleSortDirection}
                setSortBy={setSortBy}
              />

              {searchTerm && (
                <p className="text-sm text-gray-500">
                  Found {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
                </p>
              )}

              {filteredItems.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <FilterIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-600">No items match your filters</p>
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    className="mt-2"
                    onPress={() => {
                      setSearchTerm("");
                      setFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <ShoppingListItemList
                  items={filteredItems}
                  loading={loading}
                  handleToggleComplete={handleItemToggle}
                  onOpenEditModal={handleOpenEditModal}
                  onDeleteItem={onDeleteItem}
                />
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {selectedItem && (
        <EditItemModal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setTimeout(() => {
              setSelectedItem(null);
            }, 200);
          }}
          item={selectedItem}
          onUpdate={handleUpdateItem}
        />
      )}
    </>
  );
};
