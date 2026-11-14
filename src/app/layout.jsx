import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: { default: "Canteen Queue", template: "%s | Canteen Queue" },
  description: "Order ahead, get a token, skip the shouting. Canteen ordering and queue management.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Navbar />
        <main className="page-shell mx-auto w-full">{children}</main>
      </body>
    </html>
  );
}
