"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Progress,
  Tab,
  Tabs,
  useDisclosure
} from "@heroui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  FilterIcon,
  InfoIcon,
  SearchIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  SlidersHorizontalIcon,
  TrashIcon
} from "lucide-react";
import { useMemo, useState } from "react";
import EditItemModal from "~/app/[locale]/shopping-lists/components/EditItemModal";
import type { ShoppingList } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList";
import type { ShoppingListItem } from "~/applications/ShoppingLists/Domain/Entities/ShoppingListItem";

export default function ShoppingListDetail({
  list,
  onToggleItem,
  onDeleteItem,
  onUpdateItem
}: {
  list: ShoppingList;
  onToggleItem: (itemId: string, isCompleted: boolean) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
  onUpdateItem: (itemId: string, data: Partial<ShoppingListItem>) => Promise<void>;
}) {
  const items = list.items || [];
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<ShoppingListItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [sortBy, setSortBy] = useState<"name" | "price" | "added" | "unit">("added");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Calculer les statistiques de la liste
  const stats = useMemo(() => {
    const total = items.length;
    const checked = items.filter((item) => item.isCompleted).length;
    const unchecked = total - checked;
    const progress = total > 0 ? Math.round((checked / total) * 100) : 0;

    let totalAmount = 0;
    let checkedAmount = 0;
    let uncheckedAmount = 0;

    for (const item of items) {
      if (item.price) {
        totalAmount += item.price;
        if (item.isCompleted) {
          checkedAmount += item.price;
        } else {
          uncheckedAmount += item.price;
        }
      }
    }

    return {
      total,
      checked,
      unchecked,
      progress,
      totalAmount,
      checkedAmount,
      uncheckedAmount,
      hasPrices: totalAmount > 0
    };
  }, [items]);

  // Filtrer et trier les éléments de la liste
  const filteredItems = useMemo(() => {
    let result = [...items];

    if (searchTerm.trim()) {
      const lowercaseTerm = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.customName?.toLowerCase().includes(lowercaseTerm) ||
          item.productId?.toLowerCase().includes(lowercaseTerm)
      );
    }

    if (filter === "pending") {
      result = result.filter((item) => !item.isCompleted);
    } else if (filter === "completed") {
      result = result.filter((item) => item.isCompleted);
    }

    result.sort((a, b) => {
      let compareResult = 0;

      switch (sortBy) {
        case "name":
          compareResult = (a.customName || "").localeCompare(b.customName || "");
          break;
        case "price":
          compareResult = (a.price || 0) - (b.price || 0);
          break;
        case "unit":
          compareResult = a.unit.localeCompare(b.unit);
          break;
        case "added":
          return 0;
      }

      return sortDirection === "asc" ? compareResult : -compareResult;
    });

    return result;
  }, [items, searchTerm, filter, sortBy, sortDirection]);

  // Gérer le changement d'état d'une checkbox
  const handleToggleComplete = async (itemId: string, isCompleted: boolean) => {
    try {
      setLoading((prev) => ({ ...prev, [itemId]: true }));
      await onToggleItem(itemId, isCompleted);
    } catch (error) {
      console.error("Error toggling item completion:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleOpenEditModal = (item: ShoppingListItem) => {
    setSelectedItem(item);
    onOpen();
  };

  const handleUpdateItem = async (data: Partial<ShoppingListItem>) => {
    if (!selectedItem) return;
    await onUpdateItem(selectedItem.id, data);
    onClose();
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
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

            <div className="mt-2 pb-2 w-full">
              <div className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <ShoppingCartIcon size={18} className="text-primary-600" />
                    <span className="font-medium">Shopping Progress</span>
                  </div>
                  <div className="text-sm font-medium bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                    {stats.progress}%
                  </div>
                </div>

                <Progress
                  value={stats.progress}
                  color="primary"
                  size="md"
                  showValueLabel={false}
                  className="mb-2"
                />

                <div className="grid grid-cols-3 gap-2 text-sm mt-3">
                  <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm border border-gray-100">
                    <span className="text-gray-500">Remaining</span>
                    <span className="text-lg font-bold text-primary-400">{stats.unchecked}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm border border-gray-100">
                    <span className="text-gray-500">Completed</span>
                    <span className="text-lg font-bold text-green-600">{stats.checked}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm border border-gray-100">
                    <span className="text-gray-500">Total</span>
                    <span className="text-lg font-bold">{stats.total}</span>
                  </div>
                </div>
              </div>

              {stats.hasPrices && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <ShoppingBagIcon size={18} className="text-green-600" />
                      <span className="font-medium">Price Summary</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm border border-gray-100">
                      <span className="text-gray-500">To Buy</span>
                      <span className="text-lg font-bold text-primary-400">
                        {stats.uncheckedAmount.toFixed(2)}€
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm border border-gray-100">
                      <span className="text-gray-500">Purchased</span>
                      <span className="text-lg font-bold text-green-600">
                        {stats.checkedAmount.toFixed(2)}€
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm border border-gray-100">
                      <span className="text-gray-500">Total</span>
                      <span className="text-lg font-bold text-green-700">
                        {stats.totalAmount.toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {items.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 font-medium">Your shopping list is empty</p>
              <p className="text-sm text-gray-400 mt-1">Add items using the quick add bar above</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-3 mb-2">
                <Input
                  className="max-w-xs"
                  placeholder="Search items..."
                  startContent={<SearchIcon className="h-4 w-4 text-gray-400" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  isClearable
                  onClear={() => setSearchTerm("")}
                />

                <div className="flex gap-2 items-center">
                  <Tabs
                    selectedKey={filter}
                    onSelectionChange={(key) => setFilter(key as "all" | "pending" | "completed")}
                    size="sm"
                    color="primary"
                    className="hidden sm:flex"
                  >
                    <Tab key="all" title="All" />
                    <Tab key="pending" title="To Buy" />
                    <Tab key="completed" title="Completed" />
                  </Tabs>

                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="flat"
                        endContent={<ChevronDownIcon className="h-4 w-4" />}
                        startContent={<SlidersHorizontalIcon className="h-4 w-4" />}
                      >
                        Sort
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Sort options"
                      selectedKeys={[sortBy]}
                      selectionMode="single"
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as "name" | "price" | "added" | "unit";
                        if (selected === sortBy) {
                          toggleSortDirection();
                        } else {
                          setSortBy(selected);
                          setSortDirection("asc");
                        }
                      }}
                    >
                      <DropdownItem key="name">By Name</DropdownItem>
                      <DropdownItem key="price">By Price</DropdownItem>
                      <DropdownItem key="unit">By Unit</DropdownItem>
                      <DropdownItem key="added">By Added Date</DropdownItem>
                      <DropdownItem
                        key="direction"
                        startContent={
                          sortDirection === "asc" ? (
                            <span className="text-xs">↑ Ascending</span>
                          ) : (
                            <span className="text-xs">↓ Descending</span>
                          )
                        }
                        onClick={toggleSortDirection}
                      >
                        Toggle Direction
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>

              <div className="flex sm:hidden mb-2">
                <Tabs
                  selectedKey={filter}
                  onSelectionChange={(key) => setFilter(key as "all" | "pending" | "completed")}
                  size="sm"
                  color="primary"
                  fullWidth
                >
                  <Tab key="all" title="All" />
                  <Tab key="pending" title="To Buy" />
                  <Tab key="completed" title="Completed" />
                </Tabs>
              </div>

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
                    onClick={() => {
                      setSearchTerm("");
                      setFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <ul className="space-y-2 animate-fadeIn">
                  {filteredItems.map((item) => (
                    <li
                      key={item.id}
                      className={`flex items-center justify-between p-3 border rounded-md transition-colors cursor-pointer ${
                        item.isCompleted
                          ? "bg-gray-50 border-gray-200"
                          : "hover:bg-primary-50 border-primary-100"
                      }`}
                      onClick={() => handleOpenEditModal(item)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Checkbox
                          isSelected={item.isCompleted}
                          isDisabled={loading[item.id]}
                          onValueChange={(isChecked) => {
                            handleToggleComplete(item.id, isChecked);
                          }}
                          id={`item-${item.id}`}
                          color="success"
                          onClick={(e) => e.stopPropagation()}
                          className="bg-transparent"
                        />
                        <div className="flex flex-col">
                          <label
                            htmlFor={`item-${item.id}`}
                            className={`${
                              item.isCompleted ? "line-through text-gray-400" : "font-medium"
                            } cursor-pointer bg-transparent`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {item.customName || `Product #${item.productId?.substring(0, 8) || "Unknown"}`}
                          </label>
                          <div className="flex items-center flex-wrap gap-2 text-sm text-gray-500">
                            <span className="inline-flex items-center bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                              {item.quantity} {item.unit}
                            </span>
                            {item.price && (
                              <span className="font-medium text-green-600 inline-flex items-center bg-green-50 px-2 py-0.5 rounded-full text-xs">
                                {item.price.toFixed(2)}€
                              </span>
                            )}
                            {item.isCompleted && (
                              <span className="flex items-center text-green-600">
                                <CheckIcon size={14} className="mr-1" />
                                <span className="text-xs">Completed</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="light"
                          color="danger"
                          startContent={<TrashIcon className="h-4 w-4" />}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteItem(item.id);
                          }}
                          isIconOnly
                          className="opacity-70 hover:opacity-100"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
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
}
