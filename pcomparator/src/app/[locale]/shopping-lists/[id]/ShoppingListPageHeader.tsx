"use client";

import { Button, Modal, ModalBody, ModalContent, Tooltip, addToast, useDisclosure } from "@heroui/react";
import { Trans } from "@lingui/macro";
import {
  ArrowLeftIcon,
  DownloadIcon,
  MoreVerticalIcon,
  Share2Icon,
  TrashIcon,
  UserPlusIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteShoppingList } from "~/applications/ShoppingLists/Actions/shoppingListActions";
import ShareListModal from "../../../../applications/ShoppingLists/Ui/ShoppingListDetails/ShareListModal/ShareListModal";

interface ShoppingListPageHeaderProps {
  listId: string;
  listName: string;
}

export default function ShoppingListPageHeader({ listId, listName }: ShoppingListPageHeaderProps) {
  const router = useRouter();
  const actionsModal = useDisclosure();
  const shareModal = useDisclosure();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shopping list?")) return;

    try {
      // setIsDeleting((prev) => ({ ...prev, [id]: true }));
      await deleteShoppingList(id);

      addToast({
        title: <Trans>List deleted</Trans>,
        description: <Trans>Shopping list deleted successfully</Trans>,
        variant: "solid",
        color: "success",
        // @ts-ignore
        duration: 3000
      });

      router.replace("/shopping-lists");
    } catch (error) {
      console.error("Error deleting list:", error);

      addToast({
        title: <Trans>Error</Trans>,
        description: <Trans>Failed to delete shopping list</Trans>,
        variant: "solid",
        color: "danger"
      });
    } finally {
      // setIsDeleting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleShareList = () => {
    shareModal.onOpen();
  };

  return (
    <div className="flex flex-col gap-4 mb-6 pb-4 border-b border-gray-200">
      {/* Ligne des boutons */}
      <div className="flex items-center justify-between">
        <Tooltip content="Return to shopping lists">
          <Button
            variant="light"
            startContent={<ArrowLeftIcon className="h-4 w-4" />}
            className="text-primary-500 hover:shadow-sm transition-all px-0 min-w-0"
            onPress={() => router.push("/shopping-lists")}
          >
            {listName} (Personal)
          </Button>
        </Tooltip>

        <div className="flex items-center gap-2">
          <Tooltip content="Invite someone to collaborate">
            <Button variant="light" size="sm" isIconOnly onPress={handleShareList}>
              <UserPlusIcon className="h-4 w-4" />
            </Button>
          </Tooltip>

          <Tooltip content="More actions">
            <Button isIconOnly variant="light" size="sm" onPress={actionsModal.onOpen}>
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Modal pour les actions supplémentaires */}
      <Modal
        isOpen={actionsModal.isOpen}
        onClose={actionsModal.onClose}
        classNames={{
          base: "bg-white dark:bg-gray-800 shadow-lg rounded-lg",
          body: "p-0"
        }}
        size="4xl"
      >
        <ModalContent>
          <ModalBody className="p-0">
            <div className="divide-y divide-gray-100">
              <div
                className="flex items-center gap-2 py-3 px-4 cursor-pointer hover:bg-primary-50 transition-colors"
                onClick={() => {
                  actionsModal.onClose();
                  // Ouvrir la modal de partage
                  shareModal.onOpen();
                }}
              >
                <Share2Icon className="h-4 w-4 text-primary-600" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Share List</span>
                  <span className="text-xs text-gray-500">Share this list with others</span>
                </div>
              </div>

              <div
                className="flex items-center gap-2 py-3 px-4 cursor-pointer hover:bg-primary-50 transition-colors"
                onClick={() => {
                  actionsModal.onClose();
                  // Ajouter ici la logique pour exporter la liste
                }}
              >
                <DownloadIcon className="h-4 w-4 text-primary-600" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Export List</span>
                  <span className="text-xs text-gray-500">Export this list as CSV</span>
                </div>
              </div>

              <div
                className="flex items-center gap-2 py-3 px-4 cursor-pointer hover:bg-red-50 text-red-600 transition-colors"
                onClick={() => {
                  handleDelete(listId);
                }}
              >
                <TrashIcon className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Delete List</span>
                  <span className="text-xs text-gray-500">Delete this shopping list</span>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal de partage */}
      <ShareListModal
        isOpen={shareModal.isOpen}
        onClose={shareModal.onClose}
        listId={listId}
        listName={listName}
      />
    </div>
  );
}
