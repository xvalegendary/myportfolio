import "../globals.css";

import type { Metadata } from "next";
import { ThemeProvider } from "@/src/theme/ThemeProvider";
import { LocaleProvider } from "@/src/context/LocaleContext";
import clsx from "clsx";

export const metadata: Metadata = {
  title: "xvalegendary | portfolio",
  description: "xvalegendary portfolio",
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
            {children}
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
