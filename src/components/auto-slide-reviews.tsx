"use client";

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
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
      className="rounded-3xl bg-white p-4 text-foreground shadow-soft"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <article key={`${activeReview.name}-${activeIndex}`} className="rounded-2xl border border-border bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full bg-slate-100">
              {activeReview.image ? (
                <Image src={activeReview.image} alt={activeReview.name} fill sizes="44px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold">{activeReview.name.charAt(0)}</div>
              )}
            </div>
            <div>
              <p className="font-semibold leading-none text-foreground">{activeReview.name}</p>
              <p className="mt-1 text-xs text-foreground/60">{activeReview.reviewCount}</p>
            </div>
          </div>
          <span className="text-xs text-foreground/50">{activeReview.timeAgo}</span>
        </div>
        <div className="mt-4 flex items-center gap-1 text-amber-500">
          {Array.from({ length: activeReview.rating }).map((_, starIndex) => <Star key={starIndex} className="h-4 w-4 fill-current" />)}
        </div>
        <p className="mt-4 min-h-24 text-sm leading-6 text-foreground/80">{activeReview.comment}</p>
        <div className="mt-5 flex items-center justify-end gap-3">
          {activeReview.link ? (
            <a href={activeReview.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-950 via-cyan-950 to-slate-900 px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
              <span>Ver no</span>
              <span className="relative h-4 w-4 overflow-hidden rounded-sm" aria-hidden="true">
                <Image src="https://i.postimg.cc/QMqXM4Jx/Google-G-logo-svg.webp" alt="" fill sizes="16px" className="object-contain" />
              </span>
            </a>
          ) : null}
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
