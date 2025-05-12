"use client";

import { addToast } from "@heroui/react";
import { Trans } from "@lingui/macro";
import { useState } from "react";
import { deleteItem, toggleItemComplete, updateItem } from "~/app/[locale]/shopping-lists/[id]/action";
import type { ShoppingList } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList";
import type { ShoppingListItem } from "~/applications/ShoppingLists/Domain/Entities/ShoppingListItem";
import ShoppingListDetail from "./ShoppingListDetail";
import ShoppingListQuickAddBar from "./ShoppingListQuickAddBar";

export default function ShoppingListContainer({ initialList }: { initialList: ShoppingList }) {
  // État partagé pour les items
  const [items, setItems] = useState<ShoppingListItem[]>(initialList.items || []);

  // Fonction pour ajouter un item à l'état local
  const handleAddItem = (newItem: ShoppingListItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  // Fonctions pour manipuler les items
  const handleToggleComplete = async (itemId: string, isCompleted: boolean) => {
    try {
      // Mise à jour optimiste de l'UI
      setItems((currentItems) =>
        currentItems.map((item) => (item.id === itemId ? { ...item, isCompleted } : item))
      );

      // Appel à l'API pour persister le changement
      await toggleItemComplete(itemId, isCompleted);

      // Notification visuelle subtile pour confirmer l'action
      if (isCompleted) {
        addToast({
          title: <Trans>Item completed</Trans>,
          description: <Trans>Item marked as completed</Trans>,
          variant: "solid",
          color: "success",
          // @ts-ignore
          duration: 2000
        });
      }
    } catch (error) {
      // En cas d'erreur, revenir à l'état précédent
      console.error("Error toggling item:", error);
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
  };

  const handleUpdateItem = async (itemId: string, data: Partial<ShoppingListItem>) => {
    try {
      // Récupérer les données actuelles de l'item
      const currentItem = items.find((item) => item.id === itemId);
      if (!currentItem) return;

      // Mise à jour optimiste de l'UI
      setItems((currentItems) =>
        currentItems.map((item) => (item.id === itemId ? { ...item, ...data } : item))
      );

      // Appel à l'API pour persister le changement
      await updateItem(itemId, data);

      addToast({
        title: <Trans>Item updated</Trans>,
        description: <Trans>Item details have been updated</Trans>,
        variant: "solid",
        color: "primary",
        //@ts-ignore
        duration: 2000
      });
    } catch (error) {
      console.error("Error updating item:", error);

      // Restaurer l'état précédent en cas d'erreur
      setItems((currentItems) => [...currentItems]);

      addToast({
        title: <Trans>Error</Trans>,
        description: <Trans>Failed to update item</Trans>,
        variant: "solid",
        color: "danger"
      });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      // Optimistic UI update
      const removedItem = items.find((item) => item.id === itemId);
      setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));

      // Appel API pour persister
      await deleteItem(itemId);

      addToast({
        title: <Trans>Item removed</Trans>,
        description: removedItem?.customName ? (
          <Trans>Removed {removedItem.customName}</Trans>
        ) : (
          <Trans>Item removed from list</Trans>
        ),
        variant: "solid",
        color: "primary",
        //@ts-ignore
        duration: 3000
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      // Si erreur, restaurer l'item
      setItems((prevItems) => [...prevItems]);

      addToast({
        title: <Trans>Error</Trans>,
        description: <Trans>Failed to remove item</Trans>,
        variant: "solid",
        color: "danger"
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="flex flex-col gap-4">
        <ShoppingListQuickAddBar listId={initialList.id} onItemAdded={handleAddItem} />
      </div>

      <ShoppingListDetail
        list={{ ...initialList, items }}
        onToggleItem={handleToggleComplete}
        onDeleteItem={handleDeleteItem}
        onUpdateItem={handleUpdateItem}
      />
    </div>
  );
}
