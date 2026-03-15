import React from "react";
import Link from "next/link";
import { Button, MobileNav, Nav } from "@/components";

export const Header = () => {
  return (
    <header className="py-6 xl:py-8 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-extrabold text-heading tracking-tight">
            aminat<span className="text-primary">.</span>
          </h1>
        </Link>
        <div className="hidden xl:flex items-center gap-8">
          <Nav />
          <Link href="/contact">
            <Button>Get in Touch</Button>
          </Link>
        </div>
        <div className="xl:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
};
