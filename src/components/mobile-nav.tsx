"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CiMenuFries } from "react-icons/ci";

const links = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "experience", path: "/resume" },
  { name: "projects", path: "/work" },
  { name: "contact", path: "/contact" },
];

export const MobileNav = () => {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger className="flex justify-center items-center">
        <CiMenuFries className="text-[32px] text-primary" />
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-background">
        <div className="mt-32 mb-40 text-center text-2xl">
          <Link href="/">
            <h1 className="text-4xl font-extrabold text-heading tracking-tight">
              aminat<span className="text-primary">.</span>
            </h1>
          </Link>
        </div>
        <nav className="flex flex-col justify-center items-center gap-8">
          {links.map((link, index) => (
            <Link
              href={link.path}
              key={index}
              className={`${
                link.path === pathname
                  ? "text-primary border-b-2 border-primary"
                  : "text-heading"
              } text-xl capitalize hover:text-primary transition-colors duration-200`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
