import { useEffect, useMemo, useState } from "react";
import type { ShoppingList } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList";
import type { ShoppingListItem } from "~/applications/ShoppingLists/Domain/Entities/ShoppingListItem";

export const useShoppingListItems = (list: ShoppingList) => {
  const [items, setItems] = useState<ShoppingListItem[]>(list.items || []);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<ShoppingListItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("pending");
  const [sortBy, setSortBy] = useState<"name" | "price" | "added" | "unit">("added");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Mettre à jour les items quand list.items change
  useEffect(() => {
    setItems(list.items || []);
  }, [list.items]);

  // Calculer les stats en fonction des items actuels
  const stats = useMemo(() => {
    const completedItems = items.filter((item) => item.isCompleted);
    const pendingItems = items.filter((item) => !item.isCompleted);

    return {
      total: items.length,
      checked: completedItems.length,
      unchecked: pendingItems.length,
      progress: items.length > 0 ? Math.round((completedItems.length / items.length) * 100) : 0,
      totalAmount: items.reduce((sum, item) => sum + (item.price || 0), 0),
      checkedAmount: completedItems.reduce((sum, item) => sum + (item.price || 0), 0),
      uncheckedAmount: pendingItems.reduce((sum, item) => sum + (item.price || 0), 0),
      hasPrices: items.some((item) => !!item.price)
    };
  }, [items]);

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

    if (filter === "pending") result = result.filter((item) => !item.isCompleted);
    else if (filter === "completed") result = result.filter((item) => item.isCompleted);

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

  const handleToggleComplete = async (
    itemId: string,
    isCompleted: boolean,
    onToggleItem: (itemId: string, isCompleted: boolean) => Promise<void>
  ) => {
    try {
      setLoading((prev) => ({ ...prev, [itemId]: true }));

      // La mise à jour optimiste est maintenant gérée dans ShoppingListItemCard
      await onToggleItem(itemId, isCompleted);
    } catch (error) {
      console.error("Error toggling item completion:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  return {
    stats,
    filteredItems,
    loading,
    setLoading, // Exposer setLoading pour permettre la gestion des états de chargement
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    selectedItem,
    setSelectedItem,
    handleToggleComplete,
    toggleSortDirection
  };
};
