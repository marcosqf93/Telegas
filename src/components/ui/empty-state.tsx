import { ButtonLink } from './button';

type Props = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({ title, description, actionHref, actionLabel }: Props) {
  return (
    <div className="rounded-3xl border border-border bg-white p-6 text-center shadow-soft">
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-foreground/70">{description}</p>
      {actionHref && actionLabel ? (
        <div className="mt-4">
          <ButtonLink href={actionHref}>{actionLabel}</ButtonLink>
        </div>
      ) : null}
    </div>
  );
}
