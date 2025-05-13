import { addToast } from "@heroui/react";
import { Trans } from "@lingui/macro";
import { useCallback, useState } from "react";
import { deleteItem, toggleItemComplete, updateItem } from "~/app/[locale]/shopping-lists/[id]/action";
import type { ShoppingList } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList";
import type { ShoppingListItem } from "~/applications/ShoppingLists/Domain/Entities/ShoppingListItem";

export const useShoppingListActions = (initialList: ShoppingList) => {
  const [items, setItems] = useState<ShoppingListItem[]>(initialList.items || []);

  const handleAddItem = (newItem: ShoppingListItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const handleToggleComplete = useCallback(async (itemId: string, isCompleted: boolean) => {
    try {
      setItems((currentItems) =>
        currentItems.map((item) => (item.id === itemId ? { ...item, isCompleted } : item))
      );

      await toggleItemComplete(itemId, isCompleted);

      if (isCompleted)
        addToast({
          title: <Trans>Item completed</Trans>,
          description: <Trans>Item marked as completed</Trans>,
          variant: "solid",
          color: "success"
        });
    } catch (error) {
      setItems((currentItems) =>
        currentItems.map((item) => (item.id === itemId ? { ...item, isCompleted: !isCompleted } : item))
      );

      addToast({
        title: <Trans>Error</Trans>,
        description: <Trans>Failed to update item status</Trans>,
        variant: "solid",
        color: "danger"
      });
    }
  }, []);

  const handleUpdateItem = useCallback(async (itemId: string, data: Partial<ShoppingListItem>) => {
    try {
      const currentItem = items.find((item) => item.id === itemId);
      if (!currentItem) return;

      setItems((currentItems) =>
        currentItems.map((item) => (item.id === itemId ? { ...item, ...data } : item))
      );

      await updateItem(itemId, data);

      addToast({
        title: <Trans>Item updated</Trans>,
        description: <Trans>Item details have been updated</Trans>,
        variant: "solid",
        color: "primary"
      });
    } catch (error) {
      console.error("Error updating item:", error);

      setItems((currentItems) => [...currentItems]);

      addToast({
        title: <Trans>Error</Trans>,
        description: <Trans>Failed to update item</Trans>,
        variant: "solid",
        color: "danger"
      });
    }
  }, []);

  const handleDeleteItem = useCallback(async (itemId: string) => {
    try {
      const removedItem = items.find((item) => item.id === itemId);
      setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));

      await deleteItem(itemId);

      addToast({
        title: <Trans>Item removed</Trans>,
        description: removedItem?.customName ? (
          <Trans>Removed {removedItem.customName}</Trans>
        ) : (
          <Trans>Item removed from list</Trans>
        ),
        variant: "solid",
        color: "primary"
      });
    } catch (error) {
      setItems((prevItems) => [...prevItems]);

      addToast({
        title: <Trans>Error</Trans>,
        description: <Trans>Failed to remove item</Trans>,
        variant: "solid",
        color: "danger"
      });
    }
  }, []);

  return {
    items,
    handleAddItem,
    handleToggleComplete,
    handleUpdateItem,
    handleDeleteItem
  };
};
