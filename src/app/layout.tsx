import type { Metadata } from 'next';
import './global.css';

export const metadata: Metadata = {
  title: 'TechWithLumi | Future-ready tech training',
  description: 'Modern tech training agency helping ambitious learners build in-demand digital skills...',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
