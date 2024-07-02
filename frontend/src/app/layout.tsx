import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DiamProvider } from "@/app/components/DiamProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fractal Shares",
  description: "Created with love by team Cypher",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} dark:bg-black bg-gray-300 dark:text-white transition-all duration-500 ease-in-out`}
      >
        <DiamProvider>{children}</DiamProvider>
        <Toaster 
         position="top-right"
         reverseOrder={false}
         />
      </body>
    </html>
  );
}
