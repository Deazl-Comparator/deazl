import { Trans } from "@lingui/react/macro";
import { ArchiveIcon, ShoppingCartIcon } from "lucide-react";

export interface EmptyStateProps {
  type: "active" | "completed";
}

export const EmptyState = ({ type }: EmptyStateProps) => (
  <div className="text-center mt-12">
    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
      {type === "active" ? (
        <ShoppingCartIcon className="h-8 w-8 text-gray-400" />
      ) : (
        <ArchiveIcon className="h-8 w-8 text-gray-400" />
      )}
    </div>
    <h3 className="text-lg font-medium text-gray-900">
      {type === "active" ? <Trans>No active shopping lists</Trans> : <Trans>No completed lists</Trans>}
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      {type === "active" ? (
        <Trans>Create your first shopping list to get started</Trans>
      ) : (
        <Trans>Completed lists will appear here</Trans>
      )}
    </p>
  </div>
);
