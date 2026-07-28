"use client";

import Link from "next/link";
import { useState } from "react";
import { SiteSettingsRecord } from "@/types";

interface NavbarProps {
  settings: SiteSettingsRecord | null;
}

export default function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-surface-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-accent">
            {settings?.businessName || "ORCHIESVISUAL"}
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link href="/#home" className="text-sm hover:text-accent transition-colors">Home</Link>
            <Link href="/portfolio" className="text-sm hover:text-accent transition-colors">Work</Link>
            <Link href="/services" className="text-sm hover:text-accent transition-colors">Services</Link>
            <Link href="/products" className="text-sm hover:text-accent transition-colors">Products</Link>
            <Link href="/about" className="text-sm hover:text-accent transition-colors">About</Link>
            <Link href="/contact" className="text-sm hover:text-accent transition-colors">Contact</Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-surface-light">
            <div className="flex flex-col space-y-4">
              <Link href="/#home" className="text-sm hover:text-accent" onClick={() => setIsOpen(false)}>Home</Link>
              <Link href="/portfolio" className="text-sm hover:text-accent" onClick={() => setIsOpen(false)}>Work</Link>
              <Link href="/services" className="text-sm hover:text-accent" onClick={() => setIsOpen(false)}>Services</Link>
              <Link href="/products" className="text-sm hover:text-accent" onClick={() => setIsOpen(false)}>Products</Link>
              <Link href="/about" className="text-sm hover:text-accent" onClick={() => setIsOpen(false)}>About</Link>
              <Link href="/contact" className="text-sm hover:text-accent" onClick={() => setIsOpen(false)}>Contact</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
