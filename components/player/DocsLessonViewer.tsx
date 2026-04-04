"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Info, Copy } from "lucide-react";

type DocsContent =
  | string
  | {
      type?: string;
      html?: string;
      markdown?: string;
    }
  | null
  | undefined;

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    // Keep latin digits/letters + Arabic range; normalize everything else to `-`.
    .replace(/[^a-z0-9\u0600-\u06FF]+/gi, "-")
    .replace(/(^-|-$)+/g, "");
}

function copyTextToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  // Fallback: legacy copy
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  ta.style.top = "0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  return Promise.resolve();
}

function safeCssEscape(value: string) {
  try {
    // eslint-disable-next-line no-undef
    if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
      // eslint-disable-next-line no-undef
      return CSS.escape(value);
    }
  } catch {
    // ignore
  }

  return value.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
}

function CodeBlock({ code, language }: { code: string; language?: string | null }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative rounded-[6px] border border-border/50 bg-slate-950 text-slate-100 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-3 py-2 border-b border-border/40">
        <div className="text-[11px] font-mono text-slate-300 truncate">
          {language ? `Code • ${language}` : "Code"}
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-200 hover:text-white disabled:opacity-60"
          disabled={copied}
          onClick={async () => {
            try {
              await copyTextToClipboard(code);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1200);
            } catch {
              // ignore: button remains usable
            }
          }}
        >
          <Copy className="w-3.5 h-3.5" />
          {copied ? "تم النسخ" : "نسخ"}
        </button>
      </div>
      <pre className="m-0 p-4 text-xs leading-6 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function isCalloutElement(el: HTMLElement) {
  const cls = el.className?.toString().toLowerCase() ?? "";
  const dataCallout = el.getAttribute("data-callout")?.toLowerCase() ?? "";
  const type = el.getAttribute("data-type")?.toLowerCase() ?? "";

  const t = dataCallout || type;
  if (t === "info" || cls.includes("callout") || cls.includes("info")) return { type: "info" as const };
  if (t === "warning" || cls.includes("warning") || cls.includes("alert")) return { type: "warning" as const };
  return null;
}

function getHeadingText(el: HTMLElement) {
  // Use textContent but trim excessive whitespace.
  return (el.textContent ?? "").replace(/\s+/g, " ").trim();
}

function renderDomNode(
  node: Node,
  key: string,
  opts: { inInlineCode?: boolean } = {}
): React.ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    return <React.Fragment key={key}>{node.textContent}</React.Fragment>;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();

  // Images
  if (tag === "img") {
    const src = el.getAttribute("src") ?? "";
    const alt = el.getAttribute("alt") ?? "";
    if (!src) return null;
    return (
      <figure key={key} className="my-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full rounded-[8px] border border-border/40" loading="lazy" />
        {alt ? <figcaption className="mt-2 text-xs text-text/50 text-right">{alt}</figcaption> : null}
      </figure>
    );
  }

  // Links
  if (tag === "a") {
    const href = el.getAttribute("href") ?? "#";
    const isExternal = /^https?:\/\//i.test(href);
    return (
      <a
        key={key}
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary/80"
      >
        {Array.from(el.childNodes).map((c, i) => renderDomNode(c, `${key}-c-${i}`, opts))}
      </a>
    );
  }

  // Code block
  if (tag === "pre") {
    const codeEl = el.querySelector("code");
    const code = (codeEl?.textContent ?? el.textContent ?? "").replace(/\n+$/g, "");
    const className = (codeEl?.className ?? "").toString();
    const langMatch = className.match(/language-([a-zA-Z0-9_-]+)/);
    const language = langMatch?.[1] ?? null;
    return <CodeBlock key={key} code={code} language={language} />;
  }

  // Inline code
  if (tag === "code") {
    return (
      <code
        key={key}
        className="px-1.5 py-0.5 rounded-[6px] bg-slate-100 border border-border/40 text-[0.9em] font-mono text-slate-900"
      >
        {Array.from(el.childNodes).map((c, i) => renderDomNode(c, `${key}-c-${i}`, { inInlineCode: true }))}
      </code>
    );
  }

  // Callouts: blockquote/div with callout-ish class/data
  if (tag === "blockquote" || tag === "div") {
    const callout = isCalloutElement(el);
    const effective =
      callout?.type ??
      (tag === "blockquote"
        ? ("info" as const)
        : null);

    if (effective) {
      const isWarn = effective === "warning";
      const Icon = isWarn ? AlertTriangle : Info;
      return (
        <div
          key={key}
          className="my-6 rounded-[10px] border border-border/60 bg-white p-4 flex gap-3 shadow-sm"
        >
          <div className={`shrink-0 mt-0.5 ${isWarn ? "text-amber-700" : "text-primary"}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 text-right">
            {Array.from(el.childNodes).map((c, i) => renderDomNode(c, `${key}-c-${i}`, opts))}
          </div>
        </div>
      );
    }
  }

  // Headings
  if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4" || tag === "h5" || tag === "h6") {
    const level = Number(tag.substring(1));
    const id = el.getAttribute("id") ?? undefined;
    const base =
      level === 1
        ? "text-3xl md:text-4xl font-extrabold tracking-tight"
        : level === 2
          ? "text-2xl md:text-3xl font-extrabold tracking-tight mt-10"
          : level === 3
            ? "text-xl md:text-2xl font-bold tracking-tight mt-8"
            : level === 5
              ? "text-lg md:text-xl font-bold tracking-tight mt-6"
              : level === 6
                ? "text-base md:text-lg font-bold tracking-tight mt-6"
            : "text-lg md:text-xl font-bold mt-6";

    return (
      React.createElement(
        tag,
        { key, id, className: `text-text ${base}` },
        Array.from(el.childNodes).map((c, i) => renderDomNode(c, `${key}-c-${i}`, opts))
      )
    );
  }

  // Paragraph
  if (tag === "p") {
    return (
      <p key={key} className="my-4 text-[15px] md:text-[16px] leading-7 text-text/85">
        {Array.from(el.childNodes).map((c, i) => renderDomNode(c, `${key}-c-${i}`, opts))}
      </p>
    );
  }

  // Lists
  if (tag === "ul" || tag === "ol") {
    const isOl = tag === "ol";
    return (
      React.createElement(
        tag,
        { key, className: "my-4 space-y-2 pr-5 text-right" },
        Array.from(el.childNodes).map((c, i) => renderDomNode(c, `${key}-c-${i}`, opts))
      )
    );
  }
  if (tag === "li") {
    return (
      <li key={key} className="text-[14px] md:text-[15px] leading-7 text-text/85">
        {Array.from(el.childNodes).map((c, i) => renderDomNode(c, `${key}-c-${i}`, opts))}
      </li>
    );
  }

  // Simple wrappers
  if (tag === "hr") return <hr key={key} className="my-8 border-border/60" />;

  // Default: map children
  return <React.Fragment key={key}>{Array.from(el.childNodes).map((c, i) => renderDomNode(c, `${key}-${i}`, opts))}</React.Fragment>;
}

export function DocsLessonViewer({
  docsContent,
  embedded = false,
}: {
  docsContent: DocsContent;
  embedded?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { html, headings } = useMemo(() => {
    const fallback: { html: string; headings: Array<{ id: string; level: number; text: string }> } = {
      html: "",
      headings: [],
    };

    let htmlStr: string | null = null;
    if (typeof docsContent === "string") htmlStr = docsContent;
    else if (docsContent && typeof docsContent === "object") {
      const anyObj = docsContent as any;
      if (typeof anyObj.html === "string") htmlStr = anyObj.html;
      else if (typeof anyObj?.content?.html === "string") htmlStr = anyObj.content.html;
    }

    if (!htmlStr) return fallback;

    // Parse + sanitize + ensure heading ids.
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlStr, "text/html");

    // Remove dangerous nodes.
    doc.querySelectorAll("script, iframe, object, embed").forEach((n) => n.remove());

    // Remove inline event handlers.
    doc.querySelectorAll("*").forEach((n) => {
      Array.from(n.attributes).forEach((attr) => {
        if (attr.name.toLowerCase().startsWith("on")) n.removeAttribute(attr.name);
        if (attr.name.toLowerCase() === "style") n.removeAttribute(attr.name);
      });
    });

    const headingEls = Array.from(doc.querySelectorAll("h1,h2,h3,h4,h5,h6"));
    const seen = new Map<string, number>();
    const computed: Array<{ id: string; level: number; text: string }> = [];

    headingEls.forEach((h) => {
      const text = getHeadingText(h as HTMLElement);
      if (!text) return;

      const level = Number((h.tagName || "").toString().replace(/\D/g, "")) || 2;
      const base = slugify(text) || "section";
      const currentCount = seen.get(base) ?? 0;
      seen.set(base, currentCount + 1);
      const id = (h.getAttribute("id") ?? "") || (currentCount === 0 ? base : `${base}-${currentCount + 1}`);
      h.setAttribute("id", id);
      computed.push({ id, level: Math.min(Math.max(level, 1), 6), text });
    });

    return { html: doc.body.innerHTML, headings: computed };
  }, [docsContent]);

  // Intersection observer for active heading.
  useEffect(() => {
    if (!headings.length) return;

    const rootEl = containerRef.current;
    if (!rootEl) return;

    const ids = headings.map((h) => h.id);
    const targets = ids
      .map((id) => rootEl.querySelector(`#${safeCssEscape(id)}`))
      .filter(Boolean) as HTMLElement[];

    if (!targets.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (!visible?.target) return;
        setActiveId((visible.target as HTMLElement).id || null);
      },
      { root: null, rootMargin: "-20% 0px -70% 0px", threshold: [0.01, 0.1, 0.2] }
    );

    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, [headings]);

  const rendered = useMemo(() => {
    if (!html) return null;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const nodes = Array.from(doc.body.childNodes);
    return nodes.map((n, i) => renderDomNode(n, `n-${i}`));
  }, [html]);

  if (!html) {
    return (
      <div className="rounded-[4px] border border-border/40 bg-white p-6 text-right">
        <p className="text-sm text-text/60">لم يتم إضافة محتوى توثيقي بعد لهذا الدرس.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {headings.length ? (
          <aside className="lg:sticky lg:top-24 self-start hidden lg:block">
            <div className="rounded-[6px] border border-border/40 bg-white p-4">
              <div className="text-[11px] font-mono text-text/50 uppercase tracking-[0.18em] mb-3 text-right">
                المحتويات
              </div>
              <div className="space-y-2">
                {headings.map((h) => {
                  const isActive = activeId === h.id;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => {
                        const el = containerRef.current?.querySelector(
                          `#${safeCssEscape(h.id)}`
                        ) as HTMLElement | null;
                        el?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className={`w-full text-right text-sm transition-colors ${
                        isActive ? "text-primary font-bold" : "text-text/70 hover:text-text"
                      }`}
                      style={{ paddingInlineStart: `${(h.level - 2) * 10}px` }}
                    >
                      {h.text}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        ) : null}

        <div ref={containerRef} className="min-w-0">
          {embedded ? (
            <div className="prose prose-sm md:prose max-w-none">{rendered}</div>
          ) : (
            <article className="bg-white border border-border/40 rounded-[8px] p-6 text-right">
              <div className="prose prose-sm md:prose max-w-none">{rendered}</div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}

