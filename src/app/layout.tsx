import type { Metadata } from "next";
import { pb } from "@/lib/pocketbase";
import { SiteSettingsRecord } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

async function getSiteSettings(): Promise<SiteSettingsRecord | null> {
  try {
    const settings = await pb.collection("site_settings").getFirstListItem('id != ""');
    return settings as unknown as SiteSettingsRecord;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: settings?.seoTitle || settings?.businessName || "Orchies Visual",
    description: settings?.seoDescription || "Professional videography and content creation",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">
        <Navbar settings={settings} />
        <main className="min-h-screen">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
