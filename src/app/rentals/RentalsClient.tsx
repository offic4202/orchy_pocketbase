"use client";

import { pb } from "@/lib/pocketbase";
import { useState } from "react";
import { ProductRecord } from "@/types";

function RentalForm({ products }: { products: ProductRecord[] }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    product: '',
    pickupDate: '',
    returnDate: '',
    notes: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to submit booking');
      
      setStatus('success');
      setFormData({ customerName: '', customerEmail: '', customerPhone: '', product: '', pickupDate: '', returnDate: '', notes: '' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            required
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            className="w-full px-4 py-3 bg-background border border-surface-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            required
            value={formData.customerEmail}
            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
            className="w-full px-4 py-3 bg-background border border-surface-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Phone</label>
        <input
          type="tel"
          required
          value={formData.customerPhone}
          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
          className="w-full px-4 py-3 bg-background border border-surface-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Select Product</label>
        <select
          required
          value={formData.product}
          onChange={(e) => setFormData({ ...formData, product: e.target.value })}
          className="w-full px-4 py-3 bg-background border border-surface-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
        >
          <option value="">Choose a product...</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - ₦{product.rentalPrice.toLocaleString()}/day
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Pickup Date</label>
          <input
            type="date"
            required
            value={formData.pickupDate}
            onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
            className="w-full px-4 py-3 bg-background border border-surface-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Return Date</label>
          <input
            type="date"
            required
            value={formData.returnDate}
            onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
            className="w-full px-4 py-3 bg-background border border-surface-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Notes (optional)</label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-4 py-3 bg-background border border-surface-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-4 bg-accent text-background font-semibold rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Submitting...' : 'Request Booking'}
      </button>

      {status === 'success' && (
        <p className="text-green-400 text-center">Booking request submitted successfully!</p>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-center">Failed to submit. Please try again.</p>
      )}
    </form>
  );
}

export default function RentalsClient({ products }: { products: ProductRecord[] }) {
  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Equipment Rentals</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Professional gear available for rent. Fill out the form below to request a booking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {products.map((product) => {
            const imageUrl = product.images?.[0]
              ? `${pb.baseUrl}/api/files/${product.id}/${product.images[0]}`
              : null;

            return (
              <div
                key={product.id}
                className="bg-surface rounded-xl overflow-hidden border border-surface-light hover:border-accent/50 transition-colors"
              >
                <div className="aspect-video bg-surface-light relative">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-600">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <span className="text-xs font-medium text-accent uppercase tracking-wider">
                    {product.category || 'Equipment'}
                  </span>
                  <h3 className="text-lg font-bold mt-2 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{product.description}</p>
                  {product.rentalPrice > 0 && (
                    <p className="text-accent font-semibold">
                      ₦{product.rentalPrice.toLocaleString()}/day
                    </p>
                  )}
                  {product.brand && (
                    <p className="text-xs text-gray-500 mt-1">Brand: {product.brand}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {products.length === 0 && (
          <p className="text-center text-gray-500">No rental products yet.</p>
        )}

        <div className="max-w-2xl mx-auto bg-surface p-8 rounded-xl border border-surface-light">
          <h3 className="text-2xl font-bold mb-6 text-center">Request a Rental</h3>
          <RentalForm products={products} />
        </div>
      </div>
    </div>
  );
}
