import { pb } from "@/lib/pocketbase";
import { BlogRecord } from "@/types";
import Link from "next/link";

async function getBlogPosts() {
  try {
    const records = await pb.collection("blog").getFullList({
      filter: 'published = true',
      sort: '-publishedAt',
    });
    return records as unknown as BlogRecord[];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & News</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Behind the scenes, updates, and stories from the journey
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No blog posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const imageUrl = post.coverImage
                ? `${pb.baseUrl}/api/files/${post.id}/${post.coverImage}`
                : null;

              return (
                <article
                  key={post.id}
                  className="bg-surface rounded-xl overflow-hidden border border-surface-light hover:border-accent/50 transition-colors"
                >
                  {imageUrl && (
                    <div className="aspect-video relative">
<img
                       src={imageUrl}
                       alt={post.title}
                       className="object-cover"
                     />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      {post.publishedAt && (
                        <span className="text-xs text-gray-500">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                      {post.featured && (
                        <span className="text-xs text-accent font-medium">Featured</span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold mb-3 hover:text-accent transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-accent text-sm font-medium hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
