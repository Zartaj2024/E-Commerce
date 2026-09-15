interface StatBoxProps {
  label: string;
  value: string | number;
  icon: string;
}

export function StatBox({ label, value, icon }: StatBoxProps) {
  return (
    <div className="rounded border border-charcoal/20 bg-kora p-5">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="font-body text-xs text-charcoal">{label}</p>
          <p className="font-heading text-2xl text-ink">{value}</p>
        </div>
      </div>
    </div>
  );
}
