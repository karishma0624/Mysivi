import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { DisclosureBar } from './DisclosureBar';

interface PageShellProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export const PageShell: React.FC<PageShellProps> = ({
  children,
  hideFooter = false,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4FF] relative overflow-hidden">
      {/* Background Lavender Wash and Ambient Glowing Blobs */}
      <div
        className="fixed -top-40 -left-40 w-96 h-96 rounded-full bg-brand-purple/10 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="fixed top-1/3 -right-40 w-[30rem] h-[30rem] rounded-full bg-brand-blue/10 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="fixed -bottom-40 left-1/4 w-[32rem] h-[32rem] rounded-full bg-brand-purple/8 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Top Disclosures */}
      <DisclosureBar />

      {/* Primary Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      {!hideFooter && <Footer />}
    </div>
  );
};
