import { pb } from "@/lib/pocketbase";
import { GalleryRecord } from "@/types";

async function getGallery() {
  try {
    const records = await pb.collection("gallery").getFullList({
      sort: 'displayOrder',
    });
    return records as unknown as GalleryRecord[];
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const images = await getGallery();

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A visual journey through my work
          </p>
        </div>

        {images.length === 0 ? (
          <p className="text-center text-gray-500">No gallery images yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="aspect-square relative rounded-lg overflow-hidden bg-surface-light"
              >
                <img
                  src={`${pb.baseUrl}/api/files/${image.id}/${image.image}`}
                  alt={image.altText || 'Gallery image'}
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
