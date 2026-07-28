import { pb } from "@/lib/pocketbase";
import { ProductRecord } from "@/types";

async function getProducts() {
  try {
    const records = await pb.collection("products").getFullList({
      filter: 'published = true',
      sort: '-created',
    });
    return records as unknown as ProductRecord[];
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  const saleProducts = products.filter((p) => p.productType === 'Sale' || p.productType === 'Both');
  const rentalProducts = products.filter((p) => p.productType === 'Rental' || p.productType === 'Both');

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Products</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Professional equipment for sale and rent
          </p>
        </div>

        {rentalProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-accent">For Rent</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentalProducts.map((product) => {
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
                           className="object-cover"
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {saleProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-8 text-accent">For Sale</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {saleProducts.map((product) => {
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
                           className="object-cover"
                         />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-600">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-medium text-accent uppercase tracking-wider">
                        {product.category || 'Product'}
                      </span>
                      <h3 className="text-lg font-bold mt-2 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-400 mb-3">{product.description}</p>
                      {product.salePrice > 0 && (
                        <p className="text-accent font-semibold">
                          ₦{product.salePrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {products.length === 0 && (
          <p className="text-center text-gray-500">No products yet.</p>
        )}
      </div>
    </div>
  );
}
