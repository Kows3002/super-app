import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Super App',
  description: 'Discover new things on Superapp',
  openGraph: {
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
