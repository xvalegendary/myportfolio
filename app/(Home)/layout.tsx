import "../globals.css";

import type { Metadata } from "next";
import Navbar from "@/components/feature/layout/navbar/navbar";
import { ThemeProvider } from "@/src/theme/ThemeProvider";
import { LocaleProvider } from "@/src/context/LocaleContext";
import clsx from "clsx";
import menuItems from '@/src/data/navItem.json';


export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Personal website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={clsx("font-bubble", "bg-background h-full")}>
        <LocaleProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navbar appName="X Y" menuItems={menuItems} />
            {children}
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
