import React from 'react';
import { ShieldCheck, Flame, Radio, Clock, ArrowUpRight } from 'lucide-react';

export const AuthIllustrationPanel: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between p-12 lg:p-16 bg-[#141518] border-l border-[#141518] w-1/2 min-h-screen text-left select-none relative overflow-hidden text-[#F3F0E8]">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#D7F04A_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Header Statement */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#D7F04A] text-[#141518] flex items-center justify-center font-heading font-black text-sm">
            F
          </div>
          <div>
            <span className="font-heading font-black text-sm uppercase tracking-tight text-white block">
              FEASTO STUDIO
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#8E929C]">
              HEARTH & DISPATCH ENGINE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] text-[#D7F04A] px-2.5 py-1 bg-white/5 border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D7F04A] animate-pulse" />
          <span>KITCHEN NETWORK LIVE</span>
        </div>
      </div>

      {/* Central Editorial Statement & Live Telemetry Artifact */}
      <div className="max-w-lg w-full mx-auto my-auto space-y-8 z-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase font-bold text-[#D7F04A] tracking-widest">
            <span>[OPERATIONS · STUDIO V2]</span>
          </div>
          <h2 className="font-heading font-black text-3xl xl:text-4xl uppercase tracking-tight text-white leading-tight">
            RUN YOUR KITCHEN WITH RADICAL CLARITY.
          </h2>
          <p className="font-sans text-sm text-[#8E929C] leading-relaxed">
            Consolidate point of sale tickets, hearth stations, courier handover, and real-time revenue velocity into a single tactical control surface.
          </p>
        </div>

        {/* Live Hearth Telemetry Dossier */}
        <div className="border border-white/15 bg-[#1B1E24] p-6 space-y-5 relative shadow-[6px_6px_0px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Flame size={15} className="text-[#D7F04A]" />
              <span className="font-mono text-[10px] uppercase font-black tracking-wider text-white">
                LIVE HEARTH THROUGHPUT
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#8E929C]">BANGALORE NORTH HUB</span>
          </div>

          <div className="grid grid-cols-3 gap-4 font-mono">
            <div>
              <span className="text-[9px] uppercase text-[#8E929C] block">TICKETS DISPATCHED</span>
              <strong className="text-2xl font-black text-white mt-1 block">4,821</strong>
              <span className="text-[10px] text-[#15803D] flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight size={10} /> +18.4%
              </span>
            </div>

            <div>
              <span className="text-[9px] uppercase text-[#8E929C] block">MEAN PREP LATENCY</span>
              <strong className="text-2xl font-black text-[#D7F04A] mt-1 block">13.8m</strong>
              <span className="text-[10px] text-[#8E929C] mt-0.5 block">SLA Optimal</span>
            </div>

            <div>
              <span className="text-[9px] uppercase text-[#8E929C] block">COURIER HANDOVER</span>
              <strong className="text-2xl font-black text-white mt-1 block">99.8%</strong>
              <span className="text-[10px] text-[#1B3BFF] mt-0.5 block">Zero drops</span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[11px]">
            <span className="text-[#8E929C] flex items-center gap-1.5">
              <Radio size={11} className="text-[#D7F04A]" />
              KDS Terminal Synchronized
            </span>
            <span className="text-white font-bold">FEASTO RT-04</span>
          </div>
        </div>
      </div>

      {/* Bottom Architectural Guarantee Badges */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[#8E929C] z-10 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={13} className="text-[#D7F04A]" />
          <span className="text-white font-bold">PCI-DSS 4.0 · LEVEL 1 CERTIFIED</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-[#1B3BFF]" />
          <span>99.99% RUNTIME SLA</span>
        </div>
      </div>
    </div>
  );
};
export default AuthIllustrationPanel;
