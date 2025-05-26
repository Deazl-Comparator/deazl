import { Button } from "@heroui/react";
import { Trans } from "@lingui/react/macro";
import { ArchiveIcon, PlusIcon, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";

export interface EmptyStateProps {
  type: "active" | "completed";
}

export const EmptyState = ({ type }: EmptyStateProps) => (
  <div className="text-center py-16 px-6">
    <div className="mx-auto max-w-md">
      {/* Icon with gradient background */}
      <div className="relative mx-auto mb-8 w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {type === "active" ? (
          <ShoppingCartIcon className="h-10 w-10 text-gray-500 dark:text-gray-400" />
        ) : (
          <ArchiveIcon className="h-10 w-10 text-gray-500 dark:text-gray-400" />
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        {type === "active" ? <Trans>No active shopping lists</Trans> : <Trans>No completed lists</Trans>}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
        {type === "active" ? (
          <Trans>
            Create your first shopping list to start organizing your purchases and comparing prices across
            different stores.
          </Trans>
        ) : (
          <Trans>When you complete shopping lists, they will appear here for your reference.</Trans>
        )}
      </p>

      {/* Action button for active lists only */}
      {type === "active" && (
        <Button
          color="primary"
          size="lg"
          startContent={<PlusIcon className="h-5 w-5" />}
          as={Link}
          href="/shopping-lists/create"
          className="font-semibold shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <Trans>Create Your First List</Trans>
        </Button>
      )}
    </div>
  </div>
);
