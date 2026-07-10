import type { Metadata } from 'next';
import './global.css';

export const metadata: Metadata = {
  title: 'RubyTech | A future-forward Agency',
  description: 'Bridging the gap between innovation and implementation...',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
