"use client";

import { Button } from "@heroui/react";
import { Home, LayoutDashboard, ReceiptText, User } from "lucide-react";
import type { ReactNode } from "react";
import Link from "~/components/Link/Link";

export interface TabbarProps {
  mainButton: ReactNode;
}

export const Tabbar = ({ mainButton }: TabbarProps) => (
  <div className="flex sticky bottom-0 justify-evenly py-4 border-t rounded-t-3xl border-t-transparent items-center shadow-medium bg-white dark:bg-black z-30">
    <Button as={Link} href="/" startContent={<Home />} variant="light" radius="full" isIconOnly />
    <Button
      as={Link}
      href="/dashboard/my-prices"
      startContent={<LayoutDashboard />}
      variant="light"
      radius="full"
      isIconOnly
    />
    {mainButton}
    <Button
      as={Link}
      href="/shopping-lists"
      startContent={<ReceiptText />}
      variant="light"
      radius="full"
      isIconOnly
    />
    <Button as={Link} href="/settings" startContent={<User />} variant="light" radius="full" isIconOnly />
  </div>
);
