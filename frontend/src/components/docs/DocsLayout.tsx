import React, { Suspense } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Layers,
  Component,
  Layout,
  ShieldCheck,
  Code,
  Search,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import useDocsStore from '../../store/docs/docsStore';
import DocsClientService from '../../services/docs/docsClient';

export const DocsLayout: React.FC = () => {
  const location = useLocation();
  const { searchQuery, setSearchQuery, bookmarkedPages } = useDocsStore();

  const searchResults = DocsClientService.searchDocs(searchQuery);

  const docsCategories = [
    { label: 'Overview', path: '/docs/overview', icon: <BookOpen size={14} /> },
    { label: 'Design Tokens', path: '/docs/tokens', icon: <Layers size={14} /> },
    { label: 'Component Catalog', path: '/docs/components', icon: <Component size={14} /> },
    { label: 'Patterns & Guidelines', path: '/docs/patterns', icon: <Layout size={14} /> },
    { label: 'Accessibility (A11y)', path: '/docs/accessibility', icon: <ShieldCheck size={14} /> },
    { label: 'Developer Onboarding', path: '/docs/onboarding', icon: <Code size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-neutral-900 flex flex-col">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-200/90 px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#e35205] text-white flex items-center justify-center font-black text-sm font-heading shadow-3xs">
            F
          </div>
          <div>
            <h1 className="text-sm font-black text-neutral-900 font-heading">
              Feasto Design System & Developer Portal
            </h1>
            <span className="text-[10px] text-neutral-400 font-bold">Version v2.4.1 (Enterprise Production)</span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search components, tokens, accessibility rules..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-100/90 border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#e35205] shadow-3xs"
          />

          {/* Search Dropdown Popup */}
          {searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-neutral-200 shadow-xl p-2 z-50 text-left space-y-1 max-h-64 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((res) => (
                  <NavLink
                    key={res.id}
                    to={`/docs/${res.pageId}`}
                    onClick={() => setSearchQuery('')}
                    className="block p-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-neutral-900">{res.title}</span>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {res.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">{res.snippet}</p>
                  </NavLink>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-neutral-400 font-bold">No documentation pages found.</div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Body Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-1 space-y-2 text-left">
          <div className="p-3 bg-white rounded-2xl border border-neutral-200/80 shadow-2xs space-y-1">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-3 py-1 block font-heading">
              Documentation Index
            </span>
            {docsCategories.map((cat) => {
              const isActive =
                location.pathname === cat.path ||
                (cat.path.endsWith('/overview') && (location.pathname === '/docs' || location.pathname === '/docs/'));
              return (
                <NavLink
                  key={cat.path}
                  to={cat.path}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-3xs'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  <span className={isActive ? 'text-[#e35205]' : 'text-neutral-400'}>{cat.icon}</span>
                  <span>{cat.label}</span>
                </NavLink>
              );
            })}
          </div>
        </aside>

        {/* Content Outlet */}
        <main className="lg:col-span-3">
          <Suspense fallback={<div className="py-16 text-center text-xs font-bold text-neutral-400 animate-pulse">Loading Documentation Module...</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default DocsLayout;
