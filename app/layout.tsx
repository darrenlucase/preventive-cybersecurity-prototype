import type { Metadata } from 'next';
import './globals.css';

const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
const siteUrl = explicitSiteUrl || (vercelHost ? `https://${vercelHost}` : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Preventive Cybersecurity Prototype',
  description: 'A controlled bilingual website security check for non-expert internet users.',
  openGraph: {
    title: 'Preventive Cybersecurity Prototype',
    description: 'Check a website before you trust it using deterministic, explainable signals.',
    images: [{ url: '/og.png', width: 1672, height: 941, alt: 'Check a website before you trust it — preventive cybersecurity prototype' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Preventive Cybersecurity Prototype',
    description: 'Check a website before you trust it using deterministic, explainable signals.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
