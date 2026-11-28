import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Home-screen icon for iPhones and iPads.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#03080d" }}>
        <svg width="130" height="130" viewBox="0 0 40 40" fill="none">
          <path d="M7 14q3.25-5 6.5 0t6.5 0 6.5 0 6.5 0" stroke="#6fe3d4" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M7 21q3.25-3.2 6.5 0t6.5 0 6.5 0 6.5 0" stroke="#9fd4c4" strokeOpacity="0.7" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M7 28q3.25-1.6 6.5 0t6.5 0 6.5 0 6.5 0" stroke="#e8c27a" strokeOpacity="0.45" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
