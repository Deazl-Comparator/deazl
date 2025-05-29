import { Button } from "@heroui/react";
import { Trans } from "@lingui/react/macro";
import { useMemo, useState } from "react";
import type { ShoppingListPayload } from "~/ShoppingLists/Domain/Entities/ShoppingList.entity";
import { ShoppingListItemCard } from "~/ShoppingLists/Ui/ShoppingListDetails/ShoppingListItemCard";
import { ShoppingModeScanner } from "~/ShoppingLists/Ui/ShoppingListDetails/ShoppingModeScanner";
import { SmartConversionSection } from "~/ShoppingLists/Ui/ShoppingListDetails/SmartConversionSection";
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
  const { handleAddItem, handleDeleteItem, handleToggleComplete, handleUpdateItem, items, smartConversion } =
    useShoppingListActions(initialList);

  // Shopping mode state
  const [isShoppingMode, setIsShoppingMode] = useState(false);

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
      {/* Shopping Mode Toggle */}
      {canEdit && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {isShoppingMode ? <Trans>Shopping Mode</Trans> : <Trans>Preparation Mode</Trans>}
          </h2>
          <Button
            onPress={() => setIsShoppingMode(!isShoppingMode)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isShoppingMode
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isShoppingMode ? <Trans>Exit Shopping Mode</Trans> : <Trans>Start Shopping</Trans>}
          </Button>
        </div>
      )}

      {/* Shopping Mode Scanner */}
      {canEdit && isShoppingMode && (
        <ShoppingModeScanner
          items={items}
          onItemToggleAction={async (itemId, isCompleted) => {
            await handleToggleComplete(itemId, isCompleted);
            setIsShoppingMode(false);
          }}
          onItemAddAction={handleAddItem}
          onCloseAction={() => setIsShoppingMode(false)}
        />
      )}

      {/* Normal Mode UI */}
      {!isShoppingMode && (
        <>
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

          {/* Smart Conversion Section */}
          {canEdit && smartConversion.activeNotification && (
            <SmartConversionSection
              itemId={smartConversion.activeNotification.itemId}
              itemName={smartConversion.activeNotification.itemName}
              isVisible={true}
              onConversionComplete={smartConversion.handleConversionComplete}
              onDismiss={smartConversion.dismissNotification}
            />
          )}
        </>
      )}
    </div>
  );
};
