'use client';

import { Check, Copy } from 'lucide-react';

interface RegistrationTicketProps {
  name: string;
  pathway: string;
  amountLabel: string;
  code: string;
  copiedCode: boolean;
  copiedAll: boolean;
  notifyFailed: boolean;
  onCopy: (text: string, key: 'code' | 'all') => void;
  onEdit: () => void;
}

const row =
  'flex flex-col justify-between gap-1 border-b border-[var(--line)] py-3 text-sm sm:flex-row sm:items-baseline';

export default function RegistrationTicket({
  name,
  pathway,
  amountLabel,
  code,
  copiedCode,
  copiedAll,
  notifyFailed,
  onCopy,
  onEdit,
}: RegistrationTicketProps) {
  return (
    <div className="panel overflow-hidden">
      <div className="band flex flex-col gap-3 rounded-b-none px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-white text-[#0a1830]">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
          <h3 className="text-sm font-semibold text-white">Seat reserved — complete payment</h3>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
          {pathway}
        </span>
      </div>

      <div className="px-6 py-4 sm:px-7">
        <div className={row}>
          <span className="text-[var(--muted)]">Registered name</span>
          <span className="font-semibold">{name}</span>
        </div>
        <div className={row}>
          <span className="text-[var(--muted)]">Pathway</span>
          <span className="font-semibold">{pathway}</span>
        </div>
        <div className={row}>
          <span className="text-[var(--muted)]">Bank name</span>
          <span className="font-medium">Moniepoint</span>
        </div>
        <div className={row}>
          <span className="text-[var(--muted)]">Account number</span>
          <span className="font-medium tabular-nums tracking-wide">6817531903</span>
        </div>
        <div className={row}>
          <span className="text-[var(--muted)]">Account name</span>
          <span className="font-medium">Rubytech Consult</span>
        </div>
        <div className="flex flex-col justify-between gap-1 py-3 text-sm sm:flex-row sm:items-baseline">
          <span className="text-[var(--muted)]">Amount to pay</span>
          <span className="font-display text-xl font-bold tracking-[-0.02em] text-[var(--brand)]">
            {amountLabel}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[1rem] border border-dashed border-[var(--brand)] bg-[var(--brand-soft)] p-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
              Use this code as your payment narration
            </p>
            <p className="mt-1.5 font-display text-xl font-bold tracking-[0.08em] text-[var(--ink)]">
              {code}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onCopy(code, 'code')}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--surface)] px-3.5 py-2 text-xs font-semibold transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
          >
            <Copy className="h-3.5 w-3.5" />
            {copiedCode ? 'Copied!' : 'Copy code'}
          </button>
        </div>

        <p className="mt-4 rounded-[1rem] bg-[var(--surface-2)] p-4 text-xs leading-5 text-[var(--muted)]">
          <span className="font-semibold text-[var(--ink)]">Important:</span> when making your
          transfer, enter the code above in the narration/description field — this is how we match
          your payment to your registration. Keep a screenshot of your payment and this code.
        </p>

        {notifyFailed && (
          <p className="mt-3 rounded-[1rem] border border-[var(--line-strong)] p-4 text-xs leading-5 text-[var(--muted)]">
            <span className="font-semibold text-[var(--ink)]">Heads up:</span> we couldn&apos;t
            automatically notify our team about your registration. Your details and code are still
            valid — please also send a screenshot of this page to be safe.
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() =>
              onCopy(
                `Bank: Moniepoint\nAccount Number: 6817531903\nAccount Name: Rubytech Consult\nAmount to Pay: ${amountLabel}\nNarration/Description: ${code}`,
                'all'
              )
            }
            className="rounded-full border border-[var(--line-strong)] px-4 py-2.5 text-xs font-semibold transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
          >
            {copiedAll ? 'Copied!' : 'Copy account details'}
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-semibold text-[var(--faint)] transition-colors hover:text-[var(--brand)]"
          >
            Edit my details
          </button>
        </div>
      </div>
    </div>
  );
}
