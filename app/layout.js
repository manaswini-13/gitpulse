import { Archivo_Black, Space_Grotesk } from 'next/font/google';
import './globals.css';

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-archivo-black',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-grotesk',
});

export const metadata = {
  title: 'GitPulse — Neo-Brutalist Repository Health Auditor',
  description: 'Audit repository activity, maintainer velocity, and issue hygiene.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivoBlack.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-[#F4F4F0] text-black antialiased">
        {children}
      </body>
    </html>
  );
}
