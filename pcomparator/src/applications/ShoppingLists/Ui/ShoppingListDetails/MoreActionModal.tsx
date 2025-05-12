import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { DownloadIcon, Share2Icon, TrashIcon } from "lucide-react";

interface MoreActionModalProps {
  shoppingListId: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onShare: () => void;
}

export const MoreActionModal = ({
  shoppingListId,
  isOpen,
  onClose,
  onDelete,
  onShare
}: MoreActionModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
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
              onClose();
              onShare();
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
              onClose();
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
              onDelete(shoppingListId);
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
);
