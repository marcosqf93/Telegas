type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: Props) {
  return (
    <div className="max-w-3xl space-y-3">
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      {description ? <p className="text-base leading-7 text-foreground/70">{description}</p> : null}
    </div>
  );
}
