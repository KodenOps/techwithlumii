const trustedNames = [
  'Harmony Events',
  'SolutionCrest',
  'Maldini & Lounge',
  'Castrol Lounge',
  'Hydrogen Energy',
  'Helium Enterprises',
  'Strata Labs',
  'BrightLabs',
  'Glamour Events',
  'Vortex Solutions',
  'Primus Healthcare',
  'AetherWorks',
  'Zenith Dynamics',
  'Lumina Systems',
  'Nexus Innovations',
];

export default function TrustedByStrip() {
  const items = [...trustedNames, ...trustedNames];

  return (
    <section aria-label="Clients" className="shell">
      <div className="panel-flat flex flex-col gap-5 px-6 py-5 sm:flex-row sm:items-center sm:gap-8">
        <p className="flex-none rounded-full border border-[var(--line)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--faint)]">
          Worked with
        </p>
        <div
          className="marquee-wrap min-w-0 flex-1 overflow-hidden"
          style={{
            maskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)',
          }}
        >
          <div className="marquee-track flex w-max items-center gap-10">
            {items.map((name, index) => (
              <span
                key={`${name}-${index}`}
                className="whitespace-nowrap font-display text-[0.9rem] font-semibold tracking-[-0.02em] text-[var(--muted)] opacity-80"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
