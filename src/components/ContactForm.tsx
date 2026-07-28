"use client";

import { useState } from "react";
import { HomepageSettingsRecord } from "@/types";

interface ContactFormProps {
  settings: HomepageSettingsRecord | null;
}

export default function ContactForm({ settings }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to send message');
      
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Let&apos;s Work Together</h2>
          <p className="text-gray-400 text-lg">
            Have a project in mind? I&apos;d love to hear about it. Drop me a message and let&apos;s create something amazing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {settings?.email && (
            <div className="text-center">
              <div className="text-3xl mb-2">📧</div>
              <h4 className="font-semibold mb-1">Email</h4>
              <p className="text-sm text-gray-400">{settings.email}</p>
            </div>
          )}
          {settings?.phone && (
            <div className="text-center">
              <div className="text-3xl mb-2">📍</div>
              <h4 className="font-semibold mb-1">Location</h4>
              <p className="text-sm text-gray-400">Jahi, Abuja Nigeria</p>
            </div>
          )}
          {settings?.phone && (
            <div className="text-center">
              <div className="text-3xl mb-2">📱</div>
              <h4 className="font-semibold mb-1">Phone</h4>
              <p className="text-sm text-gray-400">{settings.phone}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-xl border border-surface-light max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-surface-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-surface-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Phone (optional)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-surface-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              placeholder="+234 916 163 2641"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Project Type</label>
            <select className="w-full px-4 py-3 bg-background border border-surface-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none">
              <option>Wedding</option>
              <option>Commercial</option>
              <option>Music Video</option>
              <option>Corporate</option>
              <option>Documentary</option>
              <option>Other</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Tell Me About Your Project</label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-surface-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none resize-none"
              placeholder="Tell me about your project..."
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-4 bg-accent text-background font-semibold rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'success' && (
            <p className="text-green-400 text-center mt-4">Message sent successfully!</p>
          )}
          {status === 'error' && (
            <p className="text-red-400 text-center mt-4">Failed to send message. Please try again.</p>
          )}
        </form>
      </div>
    </section>
  );
}
