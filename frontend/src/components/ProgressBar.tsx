export function ProgressBar({ value, total }: { value: number; total: number }) {
  const width = total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-nourish-muted">
        <span>
          {value} of {total} checked
        </span>
        <span>{width}%</span>
      </div>
      <div className="h-2 rounded-full bg-[#efe6dc]">
        <div className="h-2 rounded-full bg-nourish-sage transition-all" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
