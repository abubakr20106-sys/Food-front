import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./globals.css"; // agar mavjud bo'lsa

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
