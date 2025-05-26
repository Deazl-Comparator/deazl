"use client";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Progress } from "@heroui/react";
import {
  CalendarIcon,
  CheckCircleIcon,
  GlobeIcon,
  MoreVerticalIcon,
  ShoppingBagIcon,
  UsersIcon
} from "lucide-react";
import Link from "next/link";
import type { ShoppingListPayload } from "~/ShoppingLists/Domain/Entities/ShoppingList.entity";

export interface ShoppingListCardProps {
  list: ShoppingListPayload;
  userRole?: "OWNER" | "EDITOR" | "VIEWER";
}

export const ShoppingListCard = ({ list, userRole }: ShoppingListCardProps) => {
  const isOwner = userRole === "OWNER";
  const hasCollaborators = list.collaborators && list.collaborators.length > 0;
  const progress = (list.completedItems / list.totalItems) * 100;
  const isCompleted = progress === 100;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
      {/* Gradient overlay for completed lists */}
      {isCompleted && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/5 pointer-events-none" />
      )}

      {/* Hover gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <Link href={`/shopping-lists/${list.id}`} className="relative block p-6 h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-xl text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {list.name}
            </h2>
            {isCompleted && (
              <div className="flex items-center gap-1 mt-1 text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-2 ml-3">
            {hasCollaborators && (
              <div
                className="p-1.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                title="Shared list"
              >
                <UsersIcon className="h-3.5 w-3.5" />
              </div>
            )}
            {list.isPublic && (
              <div
                className="p-1.5 rounded-full bg-green-100 text-green-600 border border-green-200"
                title="Public list"
              >
                <GlobeIcon className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-md bg-gray-100 dark:bg-gray-800">
              <ShoppingBagIcon className="h-3.5 w-3.5" />
            </div>
            <span className="font-medium">{list.totalItems} items</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-md bg-gray-100 dark:bg-gray-800">
              <CalendarIcon className="h-3.5 w-3.5" />
            </div>
            <span>
              {new Date(list.createdAt!).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>

          {hasCollaborators && (
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-primary/10">
                <UsersIcon className="h-3.5 w-3.5 text-primary" />
              </div>
              <span>{list.collaborators?.length}</span>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Progress</span>
            <span className={`text-sm font-bold ${isCompleted ? "text-green-600" : "text-primary"}`}>
              {list.completedItems}/{list.totalItems}
            </span>
          </div>

          <Progress
            value={progress}
            color={isCompleted ? "success" : "primary"}
            size="md"
            className="max-w-full"
            classNames={{
              base: "max-w-full",
              track: "bg-gray-200/50 dark:bg-gray-700/50 border border-gray-300/30 dark:border-gray-600/30",
              indicator: isCompleted
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : "bg-gradient-to-r from-primary to-primary-600"
            }}
          />

          <div className="text-xs text-gray-500 dark:text-gray-400">
            {isCompleted ? "All items completed!" : `${Math.round(progress)}% complete`}
          </div>
        </div>

        {/* Hover actions */}
        {isOwner && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  isIconOnly
                  variant="flat"
                  size="sm"
                  className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:bg-white"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="List actions">
                <DropdownItem key="share" startContent={<UsersIcon className="h-4 w-4" />}>
                  Share List
                </DropdownItem>
                <DropdownItem key="edit" startContent={<ShoppingBagIcon className="h-4 w-4" />}>
                  Edit List
                </DropdownItem>
                <DropdownItem key="duplicate">Duplicate List</DropdownItem>
                <DropdownItem className="text-danger" color="danger" key="delete">
                  Delete List
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )}
      </Link>
    </div>
  );
};
