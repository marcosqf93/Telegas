import { Star } from 'lucide-react';
import type { Review } from '@/lib/site-data';

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="rounded-3xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-1 text-brand-500" aria-label={`${review.rating} estrelas`}>
        {Array.from({ length: review.rating }).map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-foreground/80">{review.excerpt}</p>
      <div className="mt-4 flex items-center justify-between gap-3 text-sm">
        <strong className="text-foreground">{review.name}</strong>
        <span className="text-foreground/50">{review.source}</span>
      </div>
    </article>
  );
}
