"use client";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { motion } from "framer-motion";
import { CalendarIcon, GlobeIcon, MoreVerticalIcon, ShoppingBagIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import type { ShoppingListPayload } from "../../Domain/Schemas/ShoppingList.schema";

export interface ShoppingListCardProps {
  list: ShoppingListPayload;
  userRole?: "OWNER" | "EDITOR" | "VIEWER";
}

export const ShoppingListCard = ({ list, userRole }: ShoppingListCardProps) => {
  const isOwner = userRole === "OWNER";
  const hasCollaborators = list.collaborators && list.collaborators.length > 0;

  return (
    <motion.div
      layout
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "0.75rem",
        border: "1px solid rgb(243 244 246)",
        backgroundColor: "white"
      }}
    >
      <Link
        href={`/shopping-lists/${list.id}`}
        className="group relative block p-4 transition duration-200 hover:bg-gray-50"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {list.name}
          </h2>
          <div className="flex items-center gap-2">
            {hasCollaborators && (
              <div className="p-1 rounded-full bg-primary-100 text-primary-600" title="Shared list">
                <UsersIcon className="h-4 w-4" />
              </div>
            )}
            {list.isPublic && (
              <div className="p-1 rounded-full bg-green-100 text-green-600" title="Public list">
                <GlobeIcon className="h-4 w-4" />
              </div>
            )}
            {isOwner && (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    className="p-1 absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="List actions">
                  <DropdownItem key="share">Share List</DropdownItem>
                  <DropdownItem key="edit">Edit List</DropdownItem>
                  <DropdownItem key="duplicate">Duplicate List</DropdownItem>
                  <DropdownItem className="text-danger" color="danger" key="delete">
                    Delete List
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
        </div>

        <div className="my-4 flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-gray-500">
            <ShoppingBagIcon className="h-4 w-4" />
            <span>{list.totalItems} items</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <CalendarIcon className="h-4 w-4" />
            <span>{new Date(list.createdAt!).toLocaleDateString()}</span>
          </div>
          {hasCollaborators && (
            <div className="flex items-center gap-1 text-gray-500">
              <UsersIcon className="h-4 w-4" />
              <span>{list.collaborators?.length} collaborators</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">Progress</span>
            <motion.span
              style={{
                color: list.completedItems === list.totalItems ? "#16a34a" : "var(--primary-600)"
              }}
              initial={false}
              animate={{
                opacity: [0.6, 1],
                scale: [0.95, 1]
              }}
              key={`${list.completedItems}-${list.totalItems}`}
            >
              {list.completedItems}/{list.totalItems}
            </motion.span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <motion.div
              style={{
                height: "100%",
                borderRadius: "9999px",
                backgroundColor: list.completedItems === list.totalItems ? "#16a34a" : "var(--primary-600)"
              }}
              initial={{ width: "0%" }}
              animate={{
                width: `${(list.completedItems / list.totalItems) * 100}%`
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
