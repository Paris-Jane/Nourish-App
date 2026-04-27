import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
};

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-3xl tracking-tight text-nourish-ink lg:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-nourish-muted">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
