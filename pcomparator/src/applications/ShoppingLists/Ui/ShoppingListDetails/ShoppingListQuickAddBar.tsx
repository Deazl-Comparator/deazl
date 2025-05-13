"use client";

import { Input, Tooltip } from "@heroui/react";
import { Trans } from "@lingui/macro";
import { HelpCircleIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { useQuickAdd } from "~/applications/ShoppingLists/Ui/ShoppingListDetails/useQuickAdd";

interface ShoppingListQuickAddBarProps {
  listId: string;
  className?: string;
}

export const ShoppingListQuickAddBar = ({ listId, className = "" }: ShoppingListQuickAddBarProps) => {
  const { handleKeyDown, inputRef, inputValue, setInputValue } = useQuickAdd();

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <SparklesIcon size={16} className="text-primary-500" />
          <span className="text-sm text-gray-600 font-medium">
            <Trans>Quick Add</Trans>
          </span>
          <Tooltip
            content={
              <div className="p-2 max-w-xs">
                <p className="font-medium mb-1">
                  <Trans>Format: quantity unit product price</Trans>
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="space-y-1 text-sm">
                  <li>• 2 apples</li>
                  <li>• 500g rice</li>
                  <li>• 1.5l milk 2.49€</li>
                </ul>
              </div>
            }
          >
            <span>
              <HelpCircleIcon size={14} className="text-gray-400 cursor-help" />
            </span>
          </Tooltip>
        </div>

        <div className="flex gap-2 items-center">
          <Input
            ref={inputRef}
            className="flex-1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add item (e.g. 500g potatoes 2.99€)"
            size="lg"
            startContent={
              <div className="text-sm text-primary-500 pointer-events-none">
                <PlusIcon size={18} />
              </div>
            }
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};
