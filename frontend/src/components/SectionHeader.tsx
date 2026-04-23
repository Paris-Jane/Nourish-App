function toTitleCase(section: string): string {
  return section
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function SectionHeader({ icon, title }: { icon: string; title: string }) {
  const display = toTitleCase(title);
  return (
    <div className="flex items-center gap-2 border-b border-dashed border-nourish-border pb-3">
      <span className="text-lg" aria-hidden>
        {icon}
      </span>
      <h3 className="font-body text-base font-semibold tracking-tight text-nourish-ink">{display}</h3>
    </div>
  );
}
