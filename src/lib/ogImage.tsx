import { ImageResponse } from "next/og";
import { SITE } from "./site";
import { wavePath } from "./wave";

/** Plain social card, drawn in code. Swap it for a photo by adding public/og/og-image.jpg. */
export function renderOgImage(width: number, height: number) {
  const wave = wavePath(1056, 20, 10, 176, 0, 12);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          color: "white",
          background: "linear-gradient(180deg, #1796b3 0%, #0b5a8a 35%, #052443 65%, #000204 100%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 8, textTransform: "uppercase", opacity: 0.85 }}>
          A concept by {SITE.author.name}
        </div>
        <div style={{ display: "flex", fontSize: 170, fontWeight: 700, lineHeight: 1, marginTop: 18 }}>{SITE.name}</div>
        <svg width="1056" height="40" viewBox="0 0 1056 40" style={{ marginTop: 6 }}>
          <path d={wave} fill="none" stroke="#9ff0ff" strokeWidth="3" />
        </svg>
        <div style={{ display: "flex", fontSize: 38, marginTop: 14, opacity: 0.9 }}>{SITE.tagline}</div>
      </div>
    ),
    { width, height },
  );
}
