import React, { useState } from 'react';
import { Megaphone, Plus, CheckCircle2, Bell, ShieldAlert, X } from 'lucide-react';
import useAdminStore, { Announcement } from '../../store/admin/adminStore';

export const AdminContent: React.FC = () => {
  const { announcements, createAnnouncement } = useAdminStore();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [category, setCategory] = useState<Announcement['category']>('maintenance');
  const [targetAudience, setTargetAudience] = useState<Announcement['targetAudience']>('all');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      createAnnouncement({
        title,
        content,
        category,
        targetAudience,
        isPublished: true,
      });
      setIsModalOpen(false);
      setTitle('');
      setContent('');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
            Platform Content & Global Announcement Broadcasts
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Publish maintenance banners, regulatory policy notices, and feature update announcements to merchants or customers
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs"
        >
          <Plus size={14} />
          <span>New Broadcast Announcement</span>
        </button>
      </div>

      {/* Announcement Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  ann.category === 'maintenance'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : ann.category === 'critical_alert'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}
              >
                {ann.category.replace('_', ' ')}
              </span>

              <span className="text-[10px] font-bold text-neutral-400">Target: {ann.targetAudience}</span>
            </div>

            <div>
              <h4 className="text-sm font-black text-neutral-900">{ann.title}</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{ann.content}</p>
            </div>

            <div className="text-[9px] text-neutral-400 pt-2 border-t border-neutral-100 flex justify-between">
              <span>Published: {ann.publishedAt ? new Date(ann.publishedAt).toLocaleDateString() : 'Draft'}</span>
              <span className="text-emerald-600 font-bold">● Active Banner</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4 text-left border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-black text-neutral-800 uppercase tracking-wider font-heading">
                Publish Platform Announcement
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-700 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. API Gateway Scheduled Maintenance Window"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#e35205]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 cursor-pointer focus:outline-none"
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="feature_release">Feature Release</option>
                  <option value="policy_update">Policy Update</option>
                  <option value="critical_alert">Critical Alert</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 cursor-pointer focus:outline-none"
                >
                  <option value="all">All Portals (Global)</option>
                  <option value="restaurants">Restaurant Merchants Only</option>
                  <option value="customers">Customers Only</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Content Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Write message copy..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs"
                >
                  Publish Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
