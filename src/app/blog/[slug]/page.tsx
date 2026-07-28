import { pb } from "@/lib/pocketbase";
import { BlogRecord } from "@/types";

async function getBlogPost(slug: string): Promise<BlogRecord | null> {
  try {
    const record = await pb.collection("blog").getFirstListItem(`slug = "${slug}" && published = true`);
    return record as unknown as BlogRecord;
  } catch {
    return null;
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return (
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-400">The blog post you&apos;re looking for doesn&apos;t exist or hasn&apos;t been published yet.</p>
        </div>
      </div>
    );
  }

  const imageUrl = post.coverImage
    ? `${pb.baseUrl}/api/files/${post.id}/${post.coverImage}`
    : null;

  return (
    <div className="pt-24 pb-16 px-4">
      <article className="max-w-4xl mx-auto">
        {imageUrl && (
          <div className="aspect-video relative mb-8 rounded-xl overflow-hidden">
            <img
              src={imageUrl}
              alt={post.title}
              className="object-cover"
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            {post.publishedAt && (
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            )}
            {post.featured && (
              <span className="text-accent">Featured</span>
            )}
          </div>
        </header>

        <div className="prose prose-invert max-w-none">
          <p className="text-xl text-gray-300 mb-8 italic">{post.excerpt}</p>
          <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>
        </div>
      </article>
    </div>
  );
}
