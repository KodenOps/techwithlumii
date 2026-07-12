import type { Metadata } from 'next';
import './global.css';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: 'RubyTech | A future-forward Agency',
  description: 'Bridging the gap between innovation and implementation...',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
