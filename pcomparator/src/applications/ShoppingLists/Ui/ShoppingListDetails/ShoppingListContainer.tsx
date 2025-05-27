import { Trans } from "@lingui/react/macro";
import { useMemo } from "react";
import type { ShoppingListPayload } from "~/ShoppingLists/Domain/Entities/ShoppingList.entity";
import { ShoppingListItemCard } from "~/ShoppingLists/Ui/ShoppingListDetails/ShoppingListItemCard";
import { SmartQuickAddBar } from "~/ShoppingLists/Ui/ShoppingListDetails/SmartQuickAddBar/SmartQuickAddBar";
import { useShoppingListActions } from "~/ShoppingLists/Ui/ShoppingListDetails/useShoppingListActions";

interface ShoppingListContainerProps {
  initialList: ShoppingListPayload;
  user: {
    id?: string;
  };
}

const noopPromise = () => Promise.resolve();

export const ShoppingListContainer = ({ initialList, user }: ShoppingListContainerProps) => {
  const { handleAddItem, handleDeleteItem, handleToggleComplete, handleUpdateItem, items } =
    useShoppingListActions(initialList);

  console.log("User ID:", user.id, "List Owner ID:", initialList.userId);
  const canEdit = useMemo(() => {
    if (!user?.id) return false;

    if (initialList.userId === user.id) return true;

    const collaborators = initialList.collaborators ?? [];
    const userRole = collaborators.find((c) => c.userId === user.id)?.role;
    return userRole ? ["OWNER", "EDITOR"].includes(userRole) : false;
  }, [initialList.userId, initialList.collaborators, user.id]);

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {canEdit ? (
        <SmartQuickAddBar
          listId={initialList.id}
          onItemAdded={handleAddItem}
          className="flex-1 min-w-[260px]"
        />
      ) : (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <p className="text-sm text-yellow-700">
            <Trans>You have view-only access to this list. Contact the owner to make changes.</Trans>
          </p>
        </div>
      )}

      <ShoppingListItemCard
        list={{ ...initialList, items }}
        onToggleItem={canEdit ? handleToggleComplete : noopPromise}
        onDeleteItem={canEdit ? handleDeleteItem : noopPromise}
        onUpdateItem={canEdit ? handleUpdateItem : noopPromise}
      />
    </div>
  );
};
