import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './global.css';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

/* Two corporate families, self-hosted.
   Archivo carries headlines and figures; IBM Plex Sans carries body
   copy, labels, navigation and form fields. */
const archivo = localFont({
  src: '../fonts/Archivo-Variable.woff2',
  weight: '400 700',
  variable: '--font-display',
  display: 'swap',
});

const plexSans = localFont({
  src: '../fonts/IBMPlexSans-Variable.woff2',
  weight: '400 700',
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RubyTech — Technology training, consulting & outsourcing',
  description:
    'RubyTech helps ambitious individuals and growing businesses build capability, ship real projects and operate better — through industry-led bootcamps, consulting and outsourcing.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexSans.variable}`}>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
