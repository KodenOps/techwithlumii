import React from "react";
function SectionMark({ color }: { color: string }) {
        const BRASS = '#B78A46';

  return (
    <div className="mx-auto flex items-center justify-center gap-3 py-2" aria-hidden="true">
      <span className="h-px w-16" style={{ background: color, opacity: 0.35 }} />
      <span className="h-1.5 w-1.5 rotate-45" style={{ background: BRASS }} />
      <span className="h-px w-16" style={{ background: color, opacity: 0.35 }} />
    </div>
  );
}
export default SectionMark