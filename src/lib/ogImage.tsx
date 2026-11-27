import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "./site";
import { wavePath } from "./wave";

/** Social card: the jellyfish photograph when it is there, a drawn gradient when it is not. */
export async function renderOgImage(width: number, height: number) {
  let photo: string | null = null;
  try {
    const buf = await readFile(join(process.cwd(), "public", "scenes", "jellyfish.jpg"));
    photo = `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    photo = null;
  }

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
          position: "relative",
        }}
      >
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" width={width} height={height} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        {photo && (
          <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(90deg, rgba(3,8,13,0.78) 0%, rgba(3,8,13,0.35) 55%, rgba(3,8,13,0) 100%)" }} />
        )}
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
