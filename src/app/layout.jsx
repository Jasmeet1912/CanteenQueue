import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: { default: "Canteen Queue", template: "%s | Canteen Queue" },
  description: "Order ahead, get a token, skip the shouting. Canteen ordering and queue management.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <main className="mx-auto max-w-4xl p-4">{children}</main>
      </body>
    </html>
  );
}
