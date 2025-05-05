"use client";

import { Image, Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import Logo from "public/static/logo.png";
import type { ReactNode } from "react";
import Link from "~/components/Link/Link";
import useDevice from "~/hooks/useDevice";

interface HeaderProps {
  rightArea: ReactNode;
}

export const Header = ({ rightArea }: HeaderProps) => {
  const device = useDevice();

  return (
    <Navbar position="static" classNames={{ base: "bg-transparent" }}>
      <NavbarBrand>
        <Link href="/" className="flex-[0_0_auto]">
          <Image src={Logo.src} fallbackSrc={Logo.blurDataURL} width={35} height={35} />
          <p className="text-xl text-inherit ml-2">PComparator</p>
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end">
        {/* <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem> */}
        {device === "desktop" ? rightArea : null}
      </NavbarContent>
    </Navbar>
  );
};
