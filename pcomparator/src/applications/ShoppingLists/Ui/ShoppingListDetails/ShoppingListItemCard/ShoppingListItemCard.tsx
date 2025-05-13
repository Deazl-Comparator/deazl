import { Button, Card, CardBody, CardHeader, useDisclosure } from "@heroui/react";
import { FilterIcon, InfoIcon, ShoppingCartIcon } from "lucide-react";
import type { ShoppingList } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList";
import type { ShoppingListItem } from "~/applications/ShoppingLists/Domain/Entities/ShoppingListItem";
import { EditItemModal } from "~/applications/ShoppingLists/Ui/ShoppingListDetails/EditItemModal";
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
  list: ShoppingList;
  onToggleItem: (itemId: string, isCompleted: boolean) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
  onUpdateItem: (itemId: string, data: Partial<ShoppingListItem>) => Promise<void>;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    stats,
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

  const handleOpenEditModal = (item: ShoppingListItem) => {
    setSelectedItem(item);
    onOpen();
  };

  const handleUpdateItem = async (data: Partial<ShoppingListItem>) => {
    if (!selectedItem) return;

    await onUpdateItem(selectedItem.id, data);
    onClose();
  };

  const handleItemToggle = async (itemId: string, isCompleted: boolean) => {
    await handleToggleComplete(itemId, isCompleted, onToggleItem);
  };

  return (
    <>
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-2 w-full">
            {list.description && (
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                <InfoIcon size={16} className="text-gray-400 flex-shrink-0" />
                <p>{list.description}</p>
              </div>
            )}

            <ShoppingListStats stats={stats} />
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
        <EditItemModal isOpen={isOpen} onClose={onClose} item={selectedItem} onUpdate={handleUpdateItem} />
      )}
    </>
  );
};
