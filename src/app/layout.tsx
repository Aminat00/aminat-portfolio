import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Header, PageTransition, StairTransition } from "@/components";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
	variable: "--font-poppins",
});

export const metadata: Metadata = {
	title: "Aminat Moldalieva",
	description: "The personal website of Aminat Moldalieva",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				{/* Add this link tag for the emoji favicon */}
				<link
					rel="icon"
					href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><text y=%2214%22 font-size=%2216%22>🍉</text></svg>"
				/>
			</head>
			<body className={poppins.variable}>
				<Header />
				<StairTransition />
				<PageTransition>{children}</PageTransition>
			</body>
		</html>
	);
}
