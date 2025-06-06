"use client";

import { Image, Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import { Trans } from "@lingui/react/macro";
import Logo from "public/static/logo.png";
import type { ReactNode } from "react";
import Link from "~/components/Link/Link";
import useDevice from "~/hooks/useDevice";
import useScroll from "~/hooks/useScroll";

interface HeaderProps {
  rightArea: ReactNode;
}

export const Header = ({ rightArea }: HeaderProps) => {
  const device = useDevice();
  const isScrolled = useScroll(64);

  console.log(isScrolled);
  return (
    <Navbar isBlurred={isScrolled} className="bg-transparent">
      <NavbarBrand>
        <Link href="/" className="flex-[0_0_auto]">
          <Image src={Logo.src} fallbackSrc={Logo.blurDataURL} width={35} height={35} />
          <p className="text-xl text-inherit ml-2">Deazl</p>
        </Link>
      </NavbarBrand>

      <NavbarContent>
        <Link href="/about">
          <Trans>About</Trans>
        </Link>
        <Link href="/pricing">
          <Trans>Pricing</Trans>
        </Link>
      </NavbarContent>

      <NavbarContent justify="end">
        {/* <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem> */}
        {device === "desktop" ? rightArea : null}
      </NavbarContent>
    </Navbar>
  );
};
