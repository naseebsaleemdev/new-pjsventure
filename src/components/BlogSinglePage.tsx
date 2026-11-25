import { useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Copy } from 'lucide-react';
import { BlogPost, PageRoute } from '../types/vehicle';

interface BlogSinglePageProps {
  post: BlogPost;
  allPosts: BlogPost[];
  onOpenPost: (post: BlogPost) => void;
  onNavigate: (route: PageRoute) => void;
}

export function BlogSinglePage({
  post,
  allPosts,
  onOpenPost,
  onNavigate,
}: BlogSinglePageProps) {
  const [copied, setCopied] = useState(false);

  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.status === 'Published')
    .slice(0, 3);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  // Safe structured block rendering (no dangerouslySetInnerHTML)
  const blocks = post.content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Breadcrumb & Utility Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500"
        >
          <button
            type="button"
            onClick={() => onNavigate({ name: 'home' })}
            className="hover:text-[#B91C1C] hover:underline cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <button
            type="button"
            onClick={() => onNavigate({ name: 'blog' })}
            className="hover:text-[#B91C1C] hover:underline cursor-pointer"
          >
            Blog
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span className="text-slate-700">{post.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span className="font-medium text-slate-950 truncate max-w-[260px] sm:max-w-md">
            {post.title}
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyUrl}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Share Article</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ name: 'blog' })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>All Articles</span>
          </button>
        </div>
      </div>

      {/* Main Article + Sidebar Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <article className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="aspect-[16/9] w-full bg-slate-100">
            <img
              src={post.coverImage}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-10 space-y-6">
            <header className="space-y-3 pb-6 border-b border-slate-200">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
                <span className="font-semibold text-[#B91C1C]">
                  {post.category}
                </span>
                <span aria-hidden="true">·</span>
                <span>{post.publishedAt}</span>
                <span aria-hidden="true">·</span>
                <span>{post.readMinutes} min read</span>
              </div>

              <h1 className="font-display text-2xl sm:text-4xl font-bold text-slate-950 tracking-tight leading-tight">
                {post.title}
              </h1>

              <p className="text-sm text-slate-600">{post.author}</p>
            </header>

            {/* Structured Article Content */}
            <div className="space-y-5 text-base text-slate-700 leading-relaxed">
              {blocks.map((block, idx) => {
                if (block.startsWith('## ')) {
                  return (
                    <h2
                      key={idx}
                      className="font-display text-xl font-bold text-slate-950 pt-2"
                    >
                      {block.replace(/^##\s+/, '')}
                    </h2>
                  );
                }

                if (block.startsWith('> ')) {
                  return (
                    <blockquote
                      key={idx}
                      className="p-4 bg-[#F8F9FA] border border-slate-200 rounded-lg text-sm font-medium text-slate-800"
                    >
                      {block.replace(/^>\s+/, '')}
                    </blockquote>
                  );
                }

                const lines = block.split('\n');
                if (lines.every((l) => l.trim().startsWith('- '))) {
                  return (
                    <ul key={idx} className="space-y-2 list-disc pl-5 text-sm sm:text-base">
                      {lines.map((line, lIdx) => (
                        <li key={lIdx}>{line.replace(/^-\s+/, '')}</li>
                      ))}
                    </ul>
                  );
                }

                return <p key={idx}>{block}</p>;
              })}
            </div>

            {post.tags.length > 0 && (
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Topics:</span>
                <span>{post.tags.join(' · ')}</span>
              </div>
            )}
          </div>
        </article>

        {/* Right Helpful Sidebar */}
        <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <h2 className="font-display text-base font-bold text-slate-950">
              Verify Any Japanese VIN / Chassis
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pull odometer history, JEVIC radiation checks, theft/salvage records, and panel condition grades before purchasing.
            </p>
            <button
              type="button"
              onClick={() => onNavigate({ name: 'page', slug: 'chassis-check' })}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              Open VIN &amp; Chassis Report
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <h2 className="font-display text-base font-bold text-slate-950">
              Ready to Browse Japan Yard Stock?
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compare live CIF prices and Port Balance units across Yokohama, Nagoya, Kobe, and Hakata.
            </p>
            <button
              type="button"
              onClick={() => onNavigate({ name: 'used-cars' })}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer"
            >
              Browse Used Cars Inventory
            </button>
          </div>
        </aside>
      </div>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="pt-8 border-t border-slate-200 space-y-5">
          <h2 className="font-display text-xl font-bold text-slate-950">
            More Export &amp; Buyer Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedPosts.map((rel) => (
              <button
                key={rel.id}
                type="button"
                onClick={() => onOpenPost(rel)}
                className="text-left bg-white border border-slate-200 rounded-xl overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="aspect-[16/10] w-full bg-slate-100">
                  <img
                    src={rel.coverImage}
                    alt={rel.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-1.5">
                  <p className="font-mono text-[11px] text-[#B91C1C] font-semibold">
                    {rel.category} · {rel.publishedAt}
                  </p>
                  <h3 className="font-display text-sm font-bold text-slate-950 line-clamp-2">
                    {rel.title}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
