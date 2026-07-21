"use client";

import { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import type { UnitReview } from '@/lib/site-data';

export function AutoSlideReviews({ reviews }: { reviews: UnitReview[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reviews.length <= 1) return;

    const timer = window.setInterval(() => {
      if (!paused) setActiveIndex((current) => (current + 1) % reviews.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [paused, reviews.length]);

  const activeReview = useMemo(() => reviews[activeIndex] ?? reviews[0], [activeIndex, reviews]);

  return (
    <div
      className="rounded-3xl bg-graphite p-4 text-white shadow-soft"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <article key={`${activeReview.name}-${activeIndex}`} className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">{activeReview.name.charAt(0)}</div>
            <div>
              <p className="font-semibold leading-none">{activeReview.name}</p>
              <p className="mt-1 text-xs text-white/60">{activeReview.reviewCount}</p>
            </div>
          </div>
          <span className="text-xs text-white/50">{activeReview.timeAgo}</span>
        </div>
        <div className="mt-4 flex items-center gap-1 text-accent">
          {Array.from({ length: activeReview.rating }).map((_, starIndex) => <Star key={starIndex} className="h-4 w-4 fill-current" />)}
        </div>
        <p className="mt-4 min-h-24 text-sm leading-6 text-white/80">{activeReview.comment}</p>
        <div className="mt-5 flex items-center justify-end gap-3">
          {activeReview.link ? <a href={activeReview.link} target="_blank" rel="noreferrer" className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white">Ver no Google</a> : null}
        </div>
      </article>
      <div className="mt-4 flex items-center justify-center gap-2">
        {reviews.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all ${index === activeIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/30'}`}
            aria-label={`Ir para avaliação ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
