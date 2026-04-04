/**
 * Parse YouTube / Vimeo URLs into iframe-safe embed URLs (no autoplay until modal opens).
 */

export type PromoVideoKind = "youtube" | "vimeo";

export interface ParsedPromoVideo {
    kind: PromoVideoKind;
    embedUrl: string;
}

function parseYoutubeId(url: string): string | null {
    const u = url.trim();
    const embed = u.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (embed) {
        return embed[1];
    }
    const short = u.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (short) {
        return short[1];
    }
    const watch = u.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watch) {
        return watch[1];
    }
    return null;
}

function parseVimeoId(url: string): string | null {
    const u = url.trim();
    const player = u.match(/player\.vimeo\.com\/video\/(\d+)/);
    if (player) {
        return player[1];
    }
    const page = u.match(/vimeo\.com\/(?:channels\/[^/]+\/|groups\/[^/]+\/videos\/)?(\d+)/);
    if (page) {
        return page[1];
    }
    return null;
}

export function parsePromoVideoUrl(raw: string): ParsedPromoVideo | null {
    const url = raw.trim();
    if (!url) {
        return null;
    }

    const yid = parseYoutubeId(url);
    if (yid) {
        return {
            kind: "youtube",
            embedUrl: `https://www.youtube.com/embed/${yid}?rel=0&modestbranding=1`,
        };
    }

    const vid = parseVimeoId(url);
    if (vid) {
        return {
            kind: "vimeo",
            embedUrl: `https://player.vimeo.com/video/${vid}?dnt=1`,
        };
    }

    return null;
}

export function isValidPromoVideoUrl(raw: string): boolean {
    if (!raw || !raw.trim()) {
        return true;
    }
    return parsePromoVideoUrl(raw) !== null;
}

/** Append autoplay for modal open (user gesture). */
export function withAutoplay(embedUrl: string): string {
    const sep = embedUrl.includes("?") ? "&" : "?";
    return `${embedUrl}${sep}autoplay=1`;
}
