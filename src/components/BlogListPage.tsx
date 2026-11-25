import { useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import { BlogCategory, BlogPost, PageRoute } from '../types/vehicle';

interface BlogListPageProps {
  posts: BlogPost[];
  onOpenPost: (post: BlogPost) => void;
  onNavigate: (route: PageRoute) => void;
}

const CATEGORIES: ('All' | BlogCategory)[] = [
  'All',
  'VIN & Inspection',
  'Port Balance',
  'Shipping & Ports',
  'Auction Tips',
  'Buying Guides',
];

export function BlogListPage({
  posts,
  onOpenPost,
  onNavigate,
}: BlogListPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | BlogCategory>(
    'All'
  );
  const [searchQuery, setSearchQuery] = useState('');

  const publishedPosts = posts.filter((p) => p.status === 'Published');

  const filteredPosts = publishedPosts.filter((post) => {
    if (selectedCategory !== 'All' && post.category !== selectedCategory) {
      return false;
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return `${post.title} ${post.excerpt} ${post.category} ${post.tags.join(' ')}`
      .toLowerCase()
      .includes(q);
  });

  const leadPost =
    selectedCategory === 'All' && !searchQuery.trim()
      ? filteredPosts[0] || null
      : null;
  const gridPosts = leadPost ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-slate-500 mb-2"
          >
            <button
              type="button"
              onClick={() => onNavigate({ name: 'home' })}
              className="hover:text-[#B91C1C] hover:underline cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span className="font-medium text-slate-900">Blog &amp; Export Guides</span>
          </nav>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            Pjs Venture Export Blog &amp; Buyer Guides
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Practical guides on Japanese VIN &amp; Chassis reports, Port Balance settlement, USS auction grades, and international shipping documentation.
          </p>
        </div>
      </div>

      {/* Category Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, VIN tips, ports..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
          />
        </div>
      </div>

      {/* Featured Lead Article */}
      {leadPost && (
        <article className="bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <button
            type="button"
            onClick={() => onOpenPost(leadPost)}
            className="lg:col-span-6 aspect-[16/10] lg:aspect-auto lg:h-full bg-slate-100 overflow-hidden cursor-pointer text-left"
          >
            <img
              src={leadPost.coverImage}
              alt={leadPost.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
            />
          </button>

          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
                <span className="font-semibold text-[#B91C1C]">
                  {leadPost.category}
                </span>
                <span aria-hidden="true">·</span>
                <span>{leadPost.publishedAt}</span>
                <span aria-hidden="true">·</span>
                <span>{leadPost.readMinutes} min read</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 leading-snug">
                <button
                  type="button"
                  onClick={() => onOpenPost(leadPost)}
                  className="text-left hover:text-[#B91C1C] transition-colors cursor-pointer"
                >
                  {leadPost.title}
                </button>
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                {leadPost.excerpt}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-600">{leadPost.author}</span>
              <button
                type="button"
                onClick={() => onOpenPost(leadPost)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors cursor-pointer"
              >
                Read Full Article →
              </button>
            </div>
          </div>
        </article>
      )}

      {/* Article Cards Grid */}
      {gridPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-150"
            >
              <div>
                <button
                  type="button"
                  onClick={() => onOpenPost(post)}
                  className="aspect-[16/10] w-full bg-slate-100 overflow-hidden cursor-pointer block"
                >
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>

                <div className="p-5 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-500">
                    <span className="font-semibold text-[#B91C1C]">
                      {post.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{post.publishedAt}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readMinutes} min read</span>
                  </div>

                  <h2 className="font-display text-lg font-bold text-slate-950 leading-snug">
                    <button
                      type="button"
                      onClick={() => onOpenPost(post)}
                      className="text-left hover:text-[#B91C1C] transition-colors cursor-pointer"
                    >
                      {post.title}
                    </button>
                  </h2>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 truncate max-w-[60%]">
                  {post.author.split('·')[0].trim()}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenPost(post)}
                  className="font-semibold text-[#B91C1C] hover:underline cursor-pointer whitespace-nowrap"
                >
                  Read Article →
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : !leadPost ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
          <p className="font-display text-base font-bold text-slate-900">
            No matching blog articles found
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer"
          >
            Show All Published Articles
          </button>
        </div>
      ) : null}
    </div>
  );
}
