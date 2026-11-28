/** World units between the middle of one zone and the next. */
export const ZONE_H = 60;

/** Y position of the centre of a zone. */
export const zoneY = (zone: number): number => -(zone + 0.5) * ZONE_H;
