/**
 * SVG path for a sine wave drawn as a polyline.
 * With width = 2 * k * period the shape repeats exactly after half its width,
 * so translating it by -50% loops without a visible jump.
 */
export function wavePath(width: number, mid: number, amp: number, period: number, phase = 0, step = 20): string {
  let d = "";
  for (let x = 0; x <= width; x += step) {
    const y = mid + amp * Math.sin(((x + phase) / period) * Math.PI * 2);
    d += `${x === 0 ? "M" : "L"}${x},${y.toFixed(2)} `;
  }
  return d.trim();
}
