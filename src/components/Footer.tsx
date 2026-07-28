import Link from "next/link";
import { SiteSettingsRecord } from "@/types";

interface FooterProps {
  settings: SiteSettingsRecord | null;
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-surface border-t border-surface-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-accent mb-4">
              {settings?.businessName || "ORCHIESVISUAL"}
            </h3>
            <p className="text-sm text-gray-400">
              Creating visual stories that inspire and engage.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/portfolio" className="text-sm text-gray-400 hover:text-accent">Portfolio</Link></li>
              <li><Link href="/services" className="text-sm text-gray-400 hover:text-accent">Services</Link></li>
              <li><Link href="/products" className="text-sm text-gray-400 hover:text-accent">Products</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-400 hover:text-accent">Blog</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-accent">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {settings?.email && <li>Email: {settings.email}</li>}
              {settings?.phone && <li>Phone: {settings.phone}</li>}
              {settings?.address && <li>Address: {settings.address}</li>}
            </ul>
            <div className="flex space-x-4 mt-4">
              {settings?.instagram && <a href={settings.instagram} className="text-gray-400 hover:text-accent">Instagram</a>}
              {settings?.youtube && <a href={settings.youtube} className="text-gray-400 hover:text-accent">YouTube</a>}
              {settings?.facebook && <a href={settings.facebook} className="text-gray-400 hover:text-accent">Facebook</a>}
              {settings?.tiktok && <a href={settings.tiktok} className="text-gray-400 hover:text-accent">TikTok</a>}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-surface-light text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {settings?.businessName || "Orchies Visual"}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
