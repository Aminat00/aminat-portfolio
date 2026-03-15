"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "experience", path: "/resume" },
  { name: "projects", path: "/work" },
  { name: "contact", path: "/contact" },
];

export const Nav = () => {
  const pathname = usePathname();
  return (
    <nav className="flex gap-8">
      {links.map((link, index) => (
        <Link
          href={link.path}
          key={index}
          className={`${
            link.path === pathname
              ? "text-primary border-b-2 border-primary"
              : "text-body"
          } capitalize font-medium hover:text-primary transition-colors duration-200`}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
};
