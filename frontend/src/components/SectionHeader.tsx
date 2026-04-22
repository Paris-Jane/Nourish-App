export function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-dashed border-nourish-border pb-3">
      <span className="text-lg">{icon}</span>
      <h3 className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-nourish-muted">{title}</h3>
    </div>
  );
}
