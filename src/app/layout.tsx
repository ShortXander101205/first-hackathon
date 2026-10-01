import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'PathwayAI — College Major & Career Triage for Stressed Students',
    template: '%s | PathwayAI',
  },
  description:
    'An empathetic 4-question AI triage platform helping high school and early college students overcome academic anxiety and discover 4 actionable career trajectories.',
  keywords: [
    'college major triage',
    'career pathway',
    'academic anxiety reduction',
    'educational AI',
    'gemini 1.5 flash',
    'high school counselor triage',
  ],
  authors: [{ name: 'PathwayAI Team' }],
  creator: 'PathwayAI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'http://localhost:3000',
    title: 'PathwayAI — College Major & Career Triage',
    description:
      'Turn academic dread into clear career trajectories with 4 high-yield questions, empathetic reassurance, and zero-risk trial courses.',
    siteName: 'PathwayAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PathwayAI — College Major & Career Triage',
    description:
      'Empathetic college major and career triage powered by Gemini 1.5 Flash.',
  },
  icons: {
    icon: '/logo.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#1E3A8A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-edu-bg text-edu-text font-sans antialiased">
        {/* Accessible Skip Navigation Landmark */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-edu-primary focus:text-white focus:rounded-md focus:shadow-md focus:ring-2 focus:ring-edu-interactive focus:outline-none text-sm font-medium"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
