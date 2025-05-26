"use client";

import { Button, Chip, Tab, Tabs } from "@heroui/react";
import { Trans } from "@lingui/react/macro";
import { ArchiveIcon, ListPlusIcon, ShoppingCartIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ShoppingListPayload } from "~/ShoppingLists/Domain/Entities/ShoppingList.entity";
import { EmptyState, type EmptyStateProps } from "~/ShoppingLists/Ui/ShoppingLists/EmptyState";
import { ShoppingListCard } from "~/ShoppingLists/Ui/ShoppingLists/ShoppingListCard";

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
    <div className="relative w-full">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex justify-center">
              <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
                <SparklesIcon className="h-4 w-4" />
                <Trans>Smart Shopping Lists</Trans>
              </div>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <Trans>Your Shopping Lists</Trans>
            </h1>

            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
              <Trans>
                Create, organize, and share your shopping lists with ease. Compare prices and find the best
                deals automatically.
              </Trans>
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                color="primary"
                size="lg"
                startContent={<ListPlusIcon className="h-5 w-5" />}
                as={Link}
                href="/shopping-lists/create"
                className="text-base font-semibold"
              >
                <Trans>Create New List</Trans>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Lists Section */}
      <section className="relative px-4 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <Tabs
              selectedKey={filter}
              onSelectionChange={(key) => setFilter(key as EmptyStateProps["type"])}
              variant="solid"
              color="primary"
              classNames={{
                tabList:
                  "bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50",
                tab: "data-[selected=true]:bg-primary data-[selected=true]:text-white transition-all duration-200",
                cursor: "bg-primary shadow-lg"
              }}
            >
              <Tab
                key="active"
                title={
                  <div className="flex items-center gap-2 px-3">
                    <ShoppingCartIcon className="h-4 w-4" />
                    <span className="font-medium">Active Lists</span>
                    <Chip size="sm" variant="flat" color="primary" className="ml-1">
                      {activeLists.length}
                    </Chip>
                  </div>
                }
              />
              <Tab
                key="completed"
                title={
                  <div className="flex items-center gap-2 px-3">
                    <ArchiveIcon className="h-4 w-4" />
                    <span className="font-medium">Completed</span>
                    <Chip size="sm" variant="flat" color="success" className="ml-1">
                      {completedLists.length}
                    </Chip>
                  </div>
                }
              />
            </Tabs>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(filter === "active" ? activeLists : completedLists).map((list) => (
              <div key={list.id} className="group">
                <ShoppingListCard list={list} userRole={list.userRole} />
              </div>
            ))}

            {filter === "active" && activeLists.length === 0 && (
              <div className="col-span-full">
                <EmptyState type="active" />
              </div>
            )}
            {filter === "completed" && completedLists.length === 0 && (
              <div className="col-span-full">
                <EmptyState type="completed" />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
