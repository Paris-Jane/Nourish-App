import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
};

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl tracking-tight text-nourish-ink sm:text-3xl lg:text-[2.6rem]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-nourish-muted">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
