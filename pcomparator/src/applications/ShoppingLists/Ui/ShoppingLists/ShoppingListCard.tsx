"use client";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { motion } from "framer-motion";
import { CalendarIcon, GlobeIcon, MoreVerticalIcon, ShoppingBagIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import type { ShoppingListPayload } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList.entity";
import { Badge } from "~/components/ui/Badge";

export interface ShoppingListCardProps {
  list: ShoppingListPayload;
  userRole?: "OWNER" | "EDITOR" | "VIEWER";
}

export const ShoppingListCard = ({ list, userRole }: ShoppingListCardProps) => {
  const isOwner = userRole === "OWNER";
  const hasCollaborators = list.collaborators && list.collaborators.length > 0;

  return (
    <motion.div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "0.75rem",
        border: "1px solid rgb(243 244 246)",
        backgroundColor: "white",
        transition: "all 0.2s"
      }}
      initial={false}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        borderColor: "var(--primary-200)",
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/shopping-lists/${list.id}`} className="block p-4">
        <div className="mb-3 flex items-start justify-between">
          <div className="space-y-1.5">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">{list.name}</h3>
            <div className="flex flex-wrap items-center gap-1.5">
              {list.isPublic && (
                <Badge variant="info" className="gap-1">
                  <GlobeIcon className="h-3 w-3" />
                  Public
                </Badge>
              )}
              {hasCollaborators && (
                <Badge variant="secondary" className="gap-1">
                  <UsersIcon className="h-3 w-3" />
                  {list.collaborators!.length} {list.collaborators!.length === 1 ? "membre" : "membres"}
                </Badge>
              )}
              {userRole && !isOwner && (
                <Badge variant={userRole === "EDITOR" ? "success" : "default"}>
                  {userRole === "EDITOR" ? "Éditeur" : "Lecteur"}
                </Badge>
              )}
            </div>
          </div>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="List actions">
              <DropdownItem key="edit">Modifier la liste</DropdownItem>
              <DropdownItem className="text-danger" color="danger" key="delete">
                Supprimer la liste
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="mb-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-gray-500">
            <ShoppingBagIcon className="h-4 w-4" />
            <span>{list.totalItems} items</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <CalendarIcon className="h-4 w-4" />
            <span>{new Date(list.createdAt!).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">Progress</span>
            <motion.span
              style={{
                color: "var(--primary-600)"
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
