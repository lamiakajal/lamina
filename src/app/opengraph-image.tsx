import { renderOgImage } from "@/lib/ogImage";

export const alt = "Lamina: an interactive ocean descent by Lamia Kajal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage(size.width, size.height);
}
