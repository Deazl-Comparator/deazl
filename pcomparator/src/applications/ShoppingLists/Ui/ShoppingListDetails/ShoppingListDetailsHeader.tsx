"use client";

import { Button, Tooltip, addToast, useDisclosure } from "@heroui/react";
import { Trans } from "@lingui/react/macro";
import { ArrowLeftIcon, MoreVerticalIcon, UserPlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteShoppingList } from "~/applications/ShoppingLists/Actions/shoppingListActions";
import { MoreActionModal } from "~/applications/ShoppingLists/Ui/ShoppingListDetails/MoreActionModal";
import ShareListModal from "./ShareListModal/ShareListModal";

interface ShoppingListPageHeaderProps {
  shoppingListId: string;
  listName: string;
}

export const ShoppingListDetailsHeader = ({ shoppingListId, listName }: ShoppingListPageHeaderProps) => {
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
            size="md"
            startContent={<ArrowLeftIcon className="h-4 w-4" />}
            className="text-primary-500 hover:shadow-sm transition-all px-0 min-w-0"
            onPress={() => router.push("/shopping-lists")}
          >
            {listName} (Personal)
          </Button>
        </Tooltip>

        <div className="flex items-center gap-2">
          <Tooltip content="Invite someone to collaborate">
            <Button variant="light" size="md" isIconOnly onPress={handleShareList}>
              <UserPlusIcon className="h-4 w-4" />
            </Button>
          </Tooltip>

          <Tooltip content="More actions">
            <Button isIconOnly variant="light" size="md" onPress={actionsModal.onOpen}>
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <MoreActionModal
        isOpen={actionsModal.isOpen}
        onClose={actionsModal.onClose}
        onDelete={handleDelete}
        onShare={handleShareList}
        shoppingListId={shoppingListId}
      />

      <ShareListModal
        isOpen={shareModal.isOpen}
        onCloseAction={shareModal.onClose}
        listId={shoppingListId}
        listName={listName}
      />
    </div>
  );
};
