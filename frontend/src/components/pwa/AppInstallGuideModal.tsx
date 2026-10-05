import React, { useState } from 'react';
import { Laptop, Apple, Chrome, Download } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useInstallPrompt } from '../../hooks/pwa/useInstallPrompt';
import { INSTALL_GUIDES } from '../../constants/pwa';

export const AppInstallGuideModal: React.FC = () => {
  const { showInstallGuide, setShowInstallGuide } = useInstallPrompt();
  const [activeTab, setActiveTab] = useState<'ios' | 'chrome' | 'safari_mac'>('ios');

  const tabs = [
    { id: 'ios' as const, label: 'iOS (Safari)', icon: Apple },
    { id: 'chrome' as const, label: 'Android / Chrome', icon: Chrome },
    { id: 'safari_mac' as const, label: 'macOS (Safari)', icon: Laptop },
  ];

  const activeGuide = INSTALL_GUIDES[activeTab];

  return (
    <Modal
      isOpen={showInstallGuide}
      onClose={() => setShowInstallGuide(false)}
      title="How to Install Feasto"
      size="md"
      footer={
        <Button variant="primary" onClick={() => setShowInstallGuide(false)}>
          Got It
        </Button>
      }
    >
      <div className="text-center">
        {/* Graphic Header */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-orange/10 text-brand-orange mx-auto mb-4">
          <Download size={24} />
        </div>
        <p className="text-xs text-text-secondary leading-relaxed mb-6">
          Install Feasto directly to your device for quick access, lower latency, and full real-time order tracking notifications.
        </p>

        {/* Tab Headers */}
        <div className="flex border-b border-border-main mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-main ${
                  isActive
                    ? 'border-brand-orange text-brand-orange'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="bg-surface-bg p-5 rounded-xl border border-border-main text-left">
          <h4 className="text-sm font-extrabold text-text-primary mb-4 font-heading tracking-tight">
            {activeGuide.title}
          </h4>
          <ol className="space-y-3.5">
            {activeGuide.steps.map((step, index) => (
              <li key={index} className="flex gap-3 text-xs leading-relaxed text-text-secondary">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-orange/10 text-brand-orange text-[10px] font-black shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Modal>
  );
};
