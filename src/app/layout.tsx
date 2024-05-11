import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AiLice",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body><main>{children}</main></body>
    </html>
  );
}
