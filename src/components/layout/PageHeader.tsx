interface PageHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function PageHeader({ title, subtitle, centered = true }: PageHeaderProps) {
  return (
    <div className={`pt-28 lg:pt-32 pb-12 lg:pb-16 ${centered ? "text-center" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl lg:text-4xl font-display font-semibold text-ink">{title}</h1>
        {subtitle && <p className="mt-3 text-lg text-charcoal max-w-2xl mx-auto">{subtitle}</p>}
      </div>
    </div>
  );
}
