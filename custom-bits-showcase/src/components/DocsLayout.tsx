import React, { useState } from 'react';
import { Sparkles, Library, Github, Menu, X } from 'lucide-react';
import { registry, categories } from '../data/registry';

export interface DocsLayoutProps {
  children: React.ReactNode;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  activeComponentId: string | null;
  setActiveComponentId: (id: string | null) => void;
  onLogoClick?: () => void;
}

export const DocsLayout: React.FC<DocsLayoutProps> = ({
  children,
  activeCategory,
  setActiveCategory,
  activeComponentId,
  setActiveComponentId,
  onLogoClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleComponentSelect = (id: string | null) => {
    setActiveComponentId(id);
    setMobileMenuOpen(false);
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setActiveComponentId(null); // Return to index when changing category
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#131314] flex flex-col font-sans relative overflow-hidden select-none text-[#e3e3e3]">

      {/* HEADER SECTION (Google Style: Flat, clean, border outline) */}
      <header className="sticky top-0 z-40 w-full bg-[#131314] border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo Brand: "Wrap" in Outfit Geometric Font */}
          <div
            onClick={() => {
              if (onLogoClick) {
                onLogoClick();
              } else {
                handleComponentSelect(null);
              }
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-2.5 rounded-full bg-[#1e1f20] border border-[#303030] text-[#a8c7fa] group-hover:bg-[#2d2f31] transition-all duration-300">
              <Sparkles size={16} className="group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium tracking-tight text-white font-sans">
                Wrap
              </span>
            </div>
          </div>

          {/* Action Links & Icons */}
          <div className="flex items-center gap-2">
            {/* <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full border border-[#303030] bg-[#1e1f20] hover:bg-[#2d2f31] hover:border-[#444746] transition-all text-[#c4c7c5] hover:text-white"
            >
              <Github size={16} />
            </a> */}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 md:hidden rounded-full border border-[#303030] bg-[#1e1f20] hover:bg-[#2d2f31] text-[#c4c7c5] hover:text-white"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* VIEW WRAPPER */}
      <div className="flex-1 w-full max-w-[1440px] mx-auto flex">

        {/* SIDEBAR NAVIGATION Drawer (Desktop: Material 3 Round Pills) */}
        <aside className="hidden md:block w-64 shrink-0 border-r border-[#303030]/60 p-6 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">

          <div className="space-y-6">

            {/* Component Category Directory */}
            <div>
              <h3 className="text-xs font-medium text-[#8e918f] font-sans tracking-wide uppercase px-3 mb-3">
                Categories
              </h3>
              <div className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`text-left px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${activeCategory === cat && activeComponentId === null
                        ? 'bg-[#004a77] text-[#c2e7ff] font-semibold'
                        : 'text-[#c4c7c5] hover:text-white hover:bg-[#2d2f31]'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Micro-interactions Directory List */}
            <div>
              <div className="flex items-center gap-2 px-3 mb-3">
                <Library size={12} className="text-[#8e918f]" />
                <h3 className="text-xs font-medium text-[#8e918f] font-sans tracking-wide uppercase">
                  Interactions
                </h3>
              </div>
              <div className="flex flex-col gap-1">
                {registry.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleComponentSelect(item.id)}
                    className={`text-left px-4 py-2.5 rounded-full text-xs font-medium transition-all duration-200 truncate ${activeComponentId === item.id
                        ? 'bg-[#004a77] text-[#c2e7ff] font-semibold'
                        : 'text-[#c4c7c5] hover:text-white hover:bg-[#2d2f31]'
                      }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* MOBILE SIDEBAR DRAWERS */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-50 bg-[#131314] flex flex-col p-6 md:hidden overflow-y-auto space-y-6">
            <div>
              <h3 className="text-xs font-medium text-[#8e918f] font-sans tracking-wide uppercase mb-3 flex items-center justify-between">
                <span>Categories</span>
                <X size={16} className="text-[#8e918f]" onClick={() => setMobileMenuOpen(false)} />
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`text-left px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${activeCategory === cat && activeComponentId === null
                        ? 'bg-[#004a77] text-[#c2e7ff] font-semibold'
                        : 'text-[#c4c7c5] hover:text-white hover:bg-[#2d2f31]'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-medium text-[#8e918f] font-sans tracking-wide uppercase mb-3">
                Interactions
              </h3>
              <div className="flex flex-col gap-1.5">
                {registry.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleComponentSelect(item.id)}
                    className={`text-left px-4 py-2.5 rounded-full text-xs font-medium transition-all duration-200 truncate ${activeComponentId === item.id
                        ? 'bg-[#004a77] text-[#c2e7ff] font-semibold'
                        : 'text-[#c4c7c5] hover:text-white hover:bg-[#2d2f31]'
                      }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CENTRAL VIEWPORT SCROLL SPACE */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 h-[calc(100vh-64px)] relative">
          {children}
        </main>

      </div>
    </div>
  );
};

export default DocsLayout;
