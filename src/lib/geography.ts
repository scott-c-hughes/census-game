// Haversine distance between two lat/lng points in miles
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 3959; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Bearing from point1 to point2 (for directional hints)
export function bearing(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): string {
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  const brng = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;

  if (brng < 22.5 || brng >= 337.5) return "N";
  if (brng < 67.5) return "NE";
  if (brng < 112.5) return "E";
  if (brng < 157.5) return "SE";
  if (brng < 202.5) return "S";
  if (brng < 247.5) return "SW";
  if (brng < 292.5) return "W";
  return "NW";
}

// Direction arrow emoji
export function directionArrow(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): string {
  const dir = bearing(lat1, lng1, lat2, lng2);
  const arrows: Record<string, string> = {
    N: "\u2B06\uFE0F", NE: "\u2197\uFE0F", E: "\u27A1\uFE0F", SE: "\u2198\uFE0F",
    S: "\u2B07\uFE0F", SW: "\u2199\uFE0F", W: "\u2B05\uFE0F", NW: "\u2196\uFE0F",
  };
  return arrows[dir] || "";
}
