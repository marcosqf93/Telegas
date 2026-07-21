import { ButtonLink } from './button';

type Props = { title: string; description: string; actionHref?: string; actionLabel?: string };

export function ErrorState({ title, description, actionHref, actionLabel }: Props) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
      <h3 className="text-xl font-semibold text-red-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-red-800">{description}</p>
      {actionHref && actionLabel ? (
        <div className="mt-4">
          <ButtonLink href={actionHref}>{actionLabel}</ButtonLink>
        </div>
      ) : null}
    </div>
  );
}
