import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader";
import { blogPosts } from "@/data";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Blog" subtitle="Insights, guides, and news from Heavenward" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl border border-border overflow-hidden premium-card">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">{post.category}</span>
                <h3 className="text-lg font-semibold text-ink mt-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-sm text-charcoal mt-2 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-3 mt-4 text-xs text-charcoal">
                  <span>{post.author}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
