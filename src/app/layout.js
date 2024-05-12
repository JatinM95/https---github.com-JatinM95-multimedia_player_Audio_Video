import "./globals.css";

export const metadata = {
  title: "Multimedia Player",
  description: "audio/video player",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
