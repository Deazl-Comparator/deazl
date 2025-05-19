"use client";

import { Button, Chip, Tab, Tabs } from "@heroui/react";
import { Trans } from "@lingui/macro";
import { AnimatePresence, motion } from "framer-motion";
import { ArchiveIcon, ListPlusIcon, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ShoppingListPayload } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList.entity";
import { EmptyState, type EmptyStateProps } from "~/applications/ShoppingLists/Ui/ShoppingLists/EmptyState";
import { ShoppingListCard } from "~/applications/ShoppingLists/Ui/ShoppingLists/ShoppingListCard";

export interface ShoppingListViewProps {
  lists: ShoppingListPayload[];
}

export const ShoppingListsView = ({ lists }: ShoppingListViewProps) => {
  const [filter, setFilter] = useState<EmptyStateProps["type"]>("active");

  const activeLists = lists.filter((list) => {
    const progress = (list.completedItems / list.totalItems) * 100;
    return progress < 100;
  });

  const completedLists = lists.filter((list) => {
    const progress = (list.completedItems / list.totalItems) * 100;
    return progress === 100;
  });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          <Trans>Your Lists</Trans>
        </h1>
        <div className="flex gap-2">
          <Button
            color="primary"
            variant="flat"
            startContent={<ListPlusIcon className="h-4 w-4" />}
            as={Link}
            href="/shopping-lists/create"
          >
            <Trans>New List</Trans>
          </Button>
        </div>
      </div>

      <Tabs
        selectedKey={filter}
        onSelectionChange={(key) => setFilter(key as EmptyStateProps["type"])}
        variant="solid"
        color="primary"
        fullWidth
      >
        <Tab
          key="active"
          title={
            <div className="flex items-center gap-2 px-2">
              <ShoppingCartIcon className="h-4 w-4" />
              <span>Active</span>
              <Chip size="sm" variant="flat" color="primary">
                {activeLists.length}
              </Chip>
            </div>
          }
        />
        <Tab
          key="completed"
          title={
            <div className="flex items-center gap-2 px-2">
              <ArchiveIcon className="h-4 w-4" />
              <span>Completed</span>
              <Chip size="sm" variant="flat" color="default">
                {completedLists.length}
              </Chip>
            </div>
          }
        />
      </Tabs>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {(filter === "active" ? activeLists : completedLists).map((list, index) => (
            <motion.div
              key={list.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                opacity: { duration: 0.2 },
                delay: index * 0.05
              }}
            >
              <ShoppingListCard list={list} userRole={list.userRole} />
            </motion.div>
          ))}
        </AnimatePresence>

        {filter === "active" && activeLists.length === 0 && (
          <div className="col-span-2">
            <EmptyState type="active" />
          </div>
        )}
        {filter === "completed" && completedLists.length === 0 && (
          <div className="col-span-2">
            <EmptyState type="completed" />
          </div>
        )}
      </div>
    </div>
  );
};
