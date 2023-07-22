import { ReactNode } from "react";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
// import { Inter } from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
// const inter = Inter({
//   subsets: ["latin"],
//   display: "swap",
// });
import "../styles/global.css";

export const metadata = {
  title: "Kyle Zheng",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="py-12 px-4 max-w-screen-md m-auto min-h-screen flex flex-col justify-between">
        <Nav />
        <main className="flex-1 my-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
