import { addToast } from "@heroui/react";
import { Trans } from "@lingui/react/macro";
import { useCallback, useState } from "react";
import { removeItemFromList } from "~/applications/ShoppingLists/Api/removeItemFromList.api";
import { toggleItemComplete } from "~/applications/ShoppingLists/Api/toggleItemComplete.api";
import { updateShoppingListItem } from "~/applications/ShoppingLists/Api/updateShoppingListItem.api";
import type { ShoppingListPayload } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList.entity";
import type { ShoppingListItemPayload } from "~/applications/ShoppingLists/Domain/Entities/ShoppingListItem.entity";

export const useShoppingListActions = (initialList: ShoppingListPayload) => {
  const [items, setItems] = useState<ShoppingListItemPayload[]>(initialList.items || []);

  const handleAddItem = (newItem: ShoppingListItemPayload) => {
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

  const handleUpdateItem = useCallback(async (itemId: string, data: Partial<ShoppingListItemPayload>) => {
    try {
      console.log("Updating item with ID:", itemId, "with data:", data);
      const currentItem = items.find((item) => item.id === itemId);
      if (!currentItem) return;

      setItems((currentItems) =>
        currentItems.map((item) => (item.id === itemId ? { ...item, ...data } : item))
      );

      await updateShoppingListItem(itemId, data);

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

      await removeItemFromList(itemId);

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
