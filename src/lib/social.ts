export interface SocialLink {
  url: string;
  platform: "x" | "instagram" | "tiktok" | "other";
}

/**
 * Parses a social handle or URL into a clickable link.
 * - Full URLs are used as-is
 * - @handle defaults to X/Twitter
 * - Bare handles (no @) default to X/Twitter
 */
export function parseSocialHandle(handle: string): SocialLink | null {
  const trimmed = handle.trim();
  if (!trimmed) return null;

  // Full URL — detect platform from domain
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    if (trimmed.includes("instagram.com")) return { url: trimmed, platform: "instagram" };
    if (trimmed.includes("tiktok.com")) return { url: trimmed, platform: "tiktok" };
    if (trimmed.includes("twitter.com") || trimmed.includes("x.com")) return { url: trimmed, platform: "x" };
    return { url: trimmed, platform: "other" };
  }

  // @handle or bare handle — default to X
  const username = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
  if (!username) return null;

  return { url: `https://x.com/${username}`, platform: "x" };
}
