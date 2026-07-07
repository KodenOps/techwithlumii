import React from "react";
import SectionMark from "./SectionMark";

function TrustedByStrip({ line, mutedSoft, labelFont }: { line: string; mutedSoft: string; labelFont: { fontFamily: string } }) {
    const BRASS = '#B78A46';
const trustedNames = ['QueenFizzie', 'SolutionCrest', 'Maldini & Lounge', 'Castrol Lounge', 'Bokku Mart', 'Helium Enterprises', 'Strata Labs', 'BrightLabs', 'LumiTech', 'Vortex Solutions', 'NovaCore', 'AetherWorks', 'Zenith Dynamics', 'Lumina Systems', 'Nexus Innovations'];

  const items = [...trustedNames, ...trustedNames];
  return (
    <div className="py-10">
      <p className="mb-6 text-center text-[11px] uppercase tracking-[0.28em]" style={{ color: mutedSoft, ...labelFont }}>
        Trusted by teams at
      </p>
      <div className="overflow-hidden" style={{ maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)' }}>
        <div className="trusted-track flex w-max items-center gap-16">
          {items.map((n, i) => (
            <span
              key={`${n}-${i}`}
              className="whitespace-nowrap text-lg font-medium tracking-wide grayscale"
              style={{ color: mutedSoft, fontFamily: "'Fraunces', Georgia, serif" }}
            >
              {n}
            </span>
          ))}
        </div>
      </div>
      <SectionMark color={line} />
    </div>
  );
}
export default TrustedByStrip