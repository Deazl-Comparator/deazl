"use client";

import { Button, useDisclosure } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { deleteItem, toggleItemComplete } from "~/app/[locale]/shopping-lists/[id]/action";
import type { ShoppingList } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList";
import type { ShoppingListItem } from "~/applications/ShoppingLists/Domain/Entities/ShoppingListItem";
import { Modal } from "~/components/Modal/Modal";
import ShoppingListAddItemForm from "./ShoppingListAddItemForm";
import ShoppingListDetail from "./ShoppingListDetail";

export default function ShoppingListContainer({ initialList }: { initialList: ShoppingList }) {
  // État partagé pour les items
  const [items, setItems] = useState<ShoppingListItem[]>(initialList.items || []);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  // Fonction pour ajouter un item à l'état local
  const handleAddItem = (newItem: ShoppingListItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
    onClose(); // Fermer la modale après l'ajout
  };

  // Fonctions pour manipuler les items
  const handleToggleComplete = async (itemId: string, isCompleted: boolean) => {
    await toggleItemComplete(itemId, isCompleted);
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === itemId ? { ...item, isCompleted } : item))
    );
  };

  const handleDeleteItem = async (itemId: string) => {
    await deleteItem(itemId);
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{initialList.name}</h1>
        <Button color="primary" startContent={<PlusIcon size={16} />} onClick={onOpen}>
          Add Item
        </Button>
      </div>

      <ShoppingListDetail
        list={{ ...initialList, items }}
        onToggleItem={handleToggleComplete}
        onDeleteItem={handleDeleteItem}
      />

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        body={<ShoppingListAddItemForm listId={initialList.id} onItemAdded={handleAddItem} />}
        header={<p>Add New Item</p>}
      />
    </>
  );
}
