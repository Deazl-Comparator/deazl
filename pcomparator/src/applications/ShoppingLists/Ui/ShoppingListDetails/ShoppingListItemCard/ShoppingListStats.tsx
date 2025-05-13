import { Progress } from "@heroui/react";
import { ShoppingBagIcon, ShoppingCartIcon } from "lucide-react";

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
}

export const ShoppingListStats = ({ stats }: ShoppingListStatsProps) => (
  <div className="mt-2 pb-2 w-full">
    <div className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <ShoppingCartIcon size={18} className="text-primary-600" />
          <span className="font-medium">Shopping Progress</span>
        </div>
        <div className="text-sm font-medium bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
          {stats.progress}%
        </div>
      </div>

      <Progress value={stats.progress} color="primary" size="md" showValueLabel={false} className="mb-2" />

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
    </div>

    {stats.hasPrices && (
      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <ShoppingBagIcon size={18} className="text-green-600" />
            <span className="font-medium">Price Summary</span>
          </div>
        </div>

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
      </div>
    )}
  </div>
);
