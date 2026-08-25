import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { BLOG_POSTS } from "../data/blogData";
import { BlogPost } from "../types";
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Share2,
  X
} from "lucide-react";

export const BlogSection: React.FC = () => {
  const { playSfx, openBookingWithService, showToast } = useApp();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const handleShareArticle = (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = window.location.href;
    navigator.clipboard.writeText(`${post.title} — Aqutewave Insights\n${url}`);
    playSfx("sparkle");
    showToast("Article link copied!");
  };

  return (
    <section className="py-20 px-4 sm:px-6 diamond-mesh relative" aria-label="Tech Insights and Blog">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-['Orbitron'] tracking-widest uppercase mb-3">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Articles & Strategies</span>
          </div>
          <h2 className="font-['Cinzel_Decorative'] font-bold text-3xl sm:text-4xl md:text-5xl gold-gradient-text">
            Aqutewave Insights
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-3 text-sm sm:text-base">
            Expert commentary on business website development, ERP scalability in Zimbabwe, brand positioning, and digital conversion.
          </p>
          <div className="gold-divider max-w-xs mx-auto my-6" />
        </div>

        {/* Blog Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              onClick={() => {
                playSfx("pop");
                setSelectedPost(post);
              }}
              className="glass-card-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between group cursor-pointer border border-amber-500/20 hover:border-amber-400/50"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between text-[11px] text-gray-400 mb-4">
                  <span className="text-[10px] font-['Cinzel'] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-['Cinzel'] font-bold text-lg text-white group-hover:text-amber-300 transition-colors leading-snug mb-3">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-gray-400 line-clamp-3 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              {/* Author & Read Trigger */}
              <div className="pt-4 border-t border-amber-500/15 flex items-center justify-between">
                <div className="text-[11px] text-gray-400 font-mono">
                  {post.date}
                </div>

                <span className="text-xs font-['Cinzel'] font-bold text-amber-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Full Article Reader Modal */}
        {selectedPost && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedPost(null)}
            role="dialog"
            aria-modal="true"
            aria-label={selectedPost.title}
          >
            <div
              className="glass-panel w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/40 p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(212,175,55,0.2)] animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-amber-500/20 mb-6">
                <div>
                  <span className="text-[10px] font-['Cinzel'] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                    {selectedPost.category}
                  </span>
                  <h3 className="font-['Cinzel_Decorative'] font-bold text-xl sm:text-2xl md:text-3xl text-white">
                    {selectedPost.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-2 font-mono">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      <span>{selectedPost.author || "Aqutewave Engineering"}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{selectedPost.date}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{selectedPost.readTime}</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Article Content */}
              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-gray-300 leading-relaxed space-y-4 mb-8 font-['Inter']">
                {Array.isArray(selectedPost.content) ? (
                  selectedPost.content.map((paragraph, pIdx) => (
                    <p key={pIdx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="whitespace-pre-line leading-relaxed">{selectedPost.content}</p>
                )}
              </div>

              {/* Action Bar */}
              <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-gray-300 text-center sm:text-left">
                  <div className="font-bold text-white font-['Cinzel']">
                    Ready to implement these strategies in your business?
                  </div>
                  <div className="text-gray-400">
                    Book a consultation or launch your digital platform with Aqutewave.
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setSelectedPost(null);
                      openBookingWithService("standard-web");
                    }}
                    className="flex-1 sm:flex-initial btn-gold-luxury px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider"
                  >
                    START PROJECT
                  </button>
                  <button
                    onClick={(e) => handleShareArticle(selectedPost, e)}
                    className="p-2.5 rounded-xl border border-amber-500/30 text-amber-300 hover:bg-amber-400/15"
                    title="Share article"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
