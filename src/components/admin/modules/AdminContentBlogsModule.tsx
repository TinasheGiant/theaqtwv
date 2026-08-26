import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { BlogPost } from "../../../types";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Calendar,
  User,
  Clock,
  Tag,
} from "lucide-react";

export const AdminContentBlogsModule: React.FC = () => {
  const { blogsList, addBlogPost, updateBlogPost, deleteBlogPost, playSfx } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Fintech & Software");
  const [readTime, setReadTime] = useState("5 min read");
  const [image, setImage] = useState("https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80");
  const [excerpt, setExcerpt] = useState("");
  const [authorName, setAuthorName] = useState("Aqutewave Engineering");
  const [tagsStr, setTagsStr] = useState("Zimbabwe, FinTech, Web");
  const [contentParagraphsStr, setContentParagraphsStr] = useState("");

  const filtered = blogsList.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (b: BlogPost) => {
    playSfx("pop");
    setEditingBlog(b);
    setTitle(b.title);
    setCategory(b.category);
    setReadTime(b.readTime);
    setExcerpt(b.excerpt);
    setAuthorName(typeof b.author === "string" ? b.author : "Aqutewave Team");
    setTagsStr(Array.isArray(b.tags) ? b.tags.join(", ") : "");
    setContentParagraphsStr(Array.isArray(b.content) ? b.content.join("\n\n") : (b.content || ""));
    setIsCreating(false);
  };

  const startCreate = () => {
    playSfx("pop");
    setEditingBlog(null);
    setTitle("");
    setCategory("Engineering & Cloud");
    setReadTime("4 min read");
    setExcerpt("");
    setAuthorName("Aqutewave Lead Architect");
    setTagsStr("ZIMRA, Cloud, React, PostgreSQL");
    setContentParagraphsStr(
      "High availability enterprise infrastructure requires synchronized database layers and sub-second multi-currency settlement capabilities.\n\nIn modern Zimbabwean commerce, integrating instant EcoCash and InnBucks webhooks unlocks frictionless customer checkouts."
    );
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const paragraphs = contentParagraphsStr
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean);

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    if (isCreating) {
      addBlogPost({
        title,
        slug: slug || `article-${Date.now()}`,
        category,
        date: new Date().toISOString().slice(0, 10),
        readTime,
        excerpt,
        author: authorName,
        tags,
        icon: "BookOpen",
        content: paragraphs,
      });
      setIsCreating(false);
    } else if (editingBlog) {
      updateBlogPost(editingBlog.id, {
        title,
        slug: slug || editingBlog.slug,
        category,
        readTime,
        excerpt,
        author: authorName,
        tags,
        content: paragraphs,
      });
      setEditingBlog(null);
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the blog post "${title}"?`)) {
      deleteBlogPost(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-['Cinzel'] font-bold px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
              Content Module
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {blogsList.length} Published Articles
            </span>
          </div>
          <h2 className="text-xl font-['Cinzel'] font-bold text-white mt-1">
            Blog & Insights CMS
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Author technical articles, tech case studies, and corporate announcements.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="btn-gold-luxury px-4 py-2.5 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Form Drawer */}
      {(isCreating || editingBlog) && (
        <div className="p-6 rounded-3xl bg-[#0e0f14] border border-amber-400/40 shadow-2xl space-y-4 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
            <h3 className="text-sm font-['Cinzel'] font-bold text-amber-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{isCreating ? "Write New Article" : `Edit Article: ${editingBlog?.title}`}</span>
            </h3>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingBlog(null);
              }}
              className="p-1 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Article Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Next-Gen POS Architectures in Harare"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Category
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Cloud & ERP"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Estimated Read Time
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g. 5 min read"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Author Display Name
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Tawanda Chimoto"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="React, Fintech, Zimbabwe"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Short Excerpt
              </label>
              <textarea
                rows={2}
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Hook sentence for the card preview..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Article Body Paragraphs (Separate paragraphs with blank lines)
              </label>
              <textarea
                rows={5}
                required
                value={contentParagraphsStr}
                onChange={(e) => setContentParagraphsStr(e.target.value)}
                placeholder="Paragraph 1...&#10;&#10;Paragraph 2..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingBlog(null);
                }}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-['Cinzel'] font-bold hover:bg-white/15 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-gold-luxury px-5 py-2 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Save Article</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search published articles by headline or category..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
        />
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="p-5 rounded-2xl bg-[#0b0c10] border border-amber-500/20 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-4 shadow-md"
          >
            <div>
              <div className="relative h-32 rounded-xl overflow-hidden mb-3 border border-white/5">
                <div className="w-full h-full bg-linear-to-br from-amber-500/10 to-amber-950/40 flex items-center justify-center text-amber-400">
                  <BookOpen className="w-10 h-10 opacity-70" />
                </div>
                <span className="absolute top-2 left-2 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/80 text-amber-400 border border-amber-400/30">
                  {b.category}
                </span>
              </div>

              <h3 className="font-['Cinzel'] font-bold text-sm text-white line-clamp-2 mb-1.5">
                {b.title}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-2 font-light mb-3">
                {b.excerpt}
              </p>

              <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono pt-2 border-t border-white/5">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 text-amber-400" />
                  <span>{typeof b.author === "string" ? b.author : "Aqutewave Team"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{b.readTime}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => startEdit(b)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-['Cinzel'] font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(b.id, b.title)}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 cursor-pointer transition-all"
                title="Delete Article"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
