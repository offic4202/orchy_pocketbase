import { pb } from "@/lib/pocketbase";
import { PortfolioRecord } from "@/types";
import Link from "next/link";

async function getPortfolio(): Promise<PortfolioRecord[]> {
  try {
    const records = await pb.collection("portfolio").getFullList({
      filter: 'published = true',
      sort: '-completionDate',
    });
    return records as unknown as PortfolioRecord[];
  } catch {
    return [];
  }
}

export default async function PortfolioPage() {
  const portfolio = await getPortfolio();

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Portfolio</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A collection of my recent projects and collaborations
          </p>
        </div>

        {portfolio.length === 0 ? (
          <p className="text-center text-gray-500">No portfolio items yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.map((item) => {
              const imageUrl = item.thumbnail
                ? `${pb.baseUrl}/api/files/${item.id}/${item.thumbnail}`
                : null;

              return (
                <Link
                  key={item.id}
                  href={`/portfolio#${item.id}`}
                  className="group block bg-surface rounded-xl overflow-hidden hover:ring-2 hover:ring-accent transition-all"
                >
                  <div className="aspect-video bg-surface-light relative overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-600">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-medium text-accent uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-bold mt-2 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                    {item.clientName && (
                      <p className="text-xs text-gray-500 mt-2">Client: {item.clientName}</p>
                    )}
                    {item.completionDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.completionDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
