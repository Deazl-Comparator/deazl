import { Progress } from "@heroui/react";
import { ShoppingBagIcon, ShoppingCartIcon } from "lucide-react";
import { useState } from "react";
import type { ShoppingListItemPayload } from "~/ShoppingLists/Domain/Entities/ShoppingListItem.entity";
import { CollapsibleCard } from "~/components/CollapsibleCard/CollapsibleCard";
import { PostPurchaseProductCreation } from "../PostPurchaseProductCreation";

interface ShoppingListStatsProps {
  stats: {
    total: number;
    checked: number;
    unchecked: number;
    progress: number;
    totalAmount: number;
    checkedAmount: number;
    uncheckedAmount: number;
    hasPrices: boolean;
  };
  completedItems: ShoppingListItemPayload[];
}

export const ShoppingListStats = ({ stats, completedItems }: ShoppingListStatsProps) => {
  const [showPostPurchase, setShowPostPurchase] = useState(true);

  // Afficher le composant post-achat si la liste est complétée à 80% ou plus
  const shouldShowPostPurchase = stats.progress >= 80 && stats.checked > 0;

  return (
    <div className="mt-2 pb-2 w-full space-y-3">
      {/* Composant post-achat */}
      {shouldShowPostPurchase && (
        <PostPurchaseProductCreation
          completedItems={completedItems}
          isVisible={showPostPurchase}
          onHide={() => setShowPostPurchase(false)}
        />
      )}

      <CollapsibleCard
        title="Shopping Progress"
        icon={<ShoppingCartIcon size={18} className="text-primary-600" />}
        summary={
          <span className="inline-flex items-center gap-2">
            <span className="font-medium">
              {stats.checked}/{stats.total}
            </span>
            <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-xs">
              {stats.progress}%
            </span>
          </span>
        }
      >
        <Progress
          value={stats.progress}
          aria-label="shopping-list-progress"
          color="primary"
          size="md"
          showValueLabel={false}
          className="mb-2"
        />

        <div className="grid grid-cols-3 gap-2 text-sm mt-3">
          <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm border border-gray-100">
            <span className="text-gray-500">Remaining</span>
            <span className="text-lg font-bold text-primary-400">{stats.unchecked}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm border border-gray-100">
            <span className="text-gray-500">Completed</span>
            <span className="text-lg font-bold text-green-600">{stats.checked}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm border border-gray-100">
            <span className="text-gray-500">Total</span>
            <span className="text-lg font-bold">{stats.total}</span>
          </div>
        </div>
      </CollapsibleCard>

      {stats.hasPrices && (
        <CollapsibleCard
          title="Price Summary"
          icon={<ShoppingBagIcon size={18} className="text-green-600" />}
          summary={
            <div className="inline-flex items-center gap-2">
              <span className="font-medium text-green-600">{stats.totalAmount.toFixed(2)}€</span>
            </div>
          }
        >
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm border border-gray-100">
              <span className="text-gray-500">To Buy</span>
              <span className="text-lg font-bold text-primary-400">{stats.uncheckedAmount.toFixed(2)}€</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm border border-gray-100">
              <span className="text-gray-500">Purchased</span>
              <span className="text-lg font-bold text-green-600">{stats.checkedAmount.toFixed(2)}€</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm border border-gray-100">
              <span className="text-gray-500">Total</span>
              <span className="text-lg font-bold text-green-700">{stats.totalAmount.toFixed(2)}€</span>
            </div>
          </div>
        </CollapsibleCard>
      )}
    </div>
  );
};
