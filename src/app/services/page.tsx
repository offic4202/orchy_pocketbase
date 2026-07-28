import { pb } from "@/lib/pocketbase";

async function getServices() {
  try {
    const records = await pb.collection("services").getFullList({
      filter: 'published = true',
      sort: '-created',
    });
    return records as any[];
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Services</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Professional services tailored to bring your vision to life
          </p>
        </div>

        {services.length === 0 ? (
          <p className="text-center text-gray-500">No services yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const imageUrl = service.coverImage
                ? `${pb.baseUrl}/api/files/${service.id}/${service.coverImage}`
                : null;

              return (
                <div
                  key={service.id}
                  className="bg-surface rounded-xl overflow-hidden border border-surface-light hover:border-accent/50 transition-colors"
                >
                  {imageUrl && (
                    <div className="aspect-video relative">
<img
                       src={imageUrl}
                       alt={service.title}
                       className="object-cover"
                     />
                    </div>
                  )}
                  <div className="p-8">
                    <div className="text-4xl mb-4">{service.icon || '🎬'}</div>
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                    {service.startingPrice && (
                      <p className="text-accent font-semibold">
                        From ₦{service.startingPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
