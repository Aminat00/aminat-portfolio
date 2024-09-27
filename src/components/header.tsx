import React from "react";
import Link from "next/link";
import { Button, MobileNav, Nav } from "@/components";

export const Header = () => {
	return (
		<header className="py-8 xl:py-8 text-white">
			<div className="container mx-auto flex justify-between items-center">
				{/* logo */}
				<Link href="/">
					<h1 className="text-4xl font-semibold">
						Aminat<span className="text-accent"> 🍉</span>
					</h1>
				</Link>

				{/* desktop nav & hire me button */}
				<div className="hidden xl:flex items-center gap-8">
					<Nav />
					<Link href="/contact">
						<Button>Hire me</Button>
					</Link>
				</div>

				{/* mobile nav */}
				<div className="xl:hidden">
					<MobileNav />
				</div>
			</div>
		</header>
	);
};
