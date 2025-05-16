"use client";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { motion } from "framer-motion";
import { CalendarIcon, MoreVerticalIcon, ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import type { ShoppingList } from "~/applications/ShoppingLists/Domain/Entities/ShoppingList";

export interface ShoppingListCardProps {
  list: ShoppingList;
}

export const ShoppingListCard = ({ list }: ShoppingListCardProps) => (
  <motion.div
    // @ts-ignore
    className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white hover:border-primary-200 hover:shadow-lg transition-all duration-200"
    whileHover={{
      scale: 1.02,
      transition: { type: "spring", stiffness: 400, damping: 17 }
    }}
    whileTap={{ scale: 0.98 }}
  >
    <Link href={`/shopping-lists/${list.id}`} className="block p-4">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">{list.name}</h3>
        </div>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="List actions">
            <DropdownItem key="edit">Edit List</DropdownItem>
            <DropdownItem className="text-danger" color="danger" key="delete">
              Delete List
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
            // @ts-ignore
            className="text-primary-600"
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
            // @ts-ignore
            className="h-full rounded-full"
            style={{
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
