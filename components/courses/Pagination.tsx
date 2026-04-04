"use client";

import React from "react";

function getPageNumbers(current: number, last: number, maxButtons = 5): number[] {
  if (last <= 1) return [];
  const half = Math.floor(maxButtons / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(last, start + maxButtons - 1);
  start = Math.max(1, end - maxButtons + 1);

  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
}

export function Pagination({
  currentPage,
  lastPage,
  onPageChange,
}: {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}) {
  if (!lastPage || lastPage <= 1) return null;

  const pages = getPageNumbers(currentPage, lastPage, 5);
  const canPrev = currentPage > 1;
  const canNext = currentPage < lastPage;

  return (
    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-text/60">
        الصفحة {currentPage} من {lastPage}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-4 py-2 rounded border border-border/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          السابق
        </button>

        <div className="flex items-center gap-1">
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              disabled={p === currentPage}
              className={`px-3 py-2 rounded border border-border/80 transition-colors ${
                p === currentPage ? "bg-primary/10 border-primary/40" : "bg-white hover:bg-primary/5"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={!canNext}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-4 py-2 rounded border border-border/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          التالي
        </button>
      </div>
    </div>
  );
}

