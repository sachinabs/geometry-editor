import type { PointData } from '../types';

export const PX_PER_CM = 20;
export const SNAP_ANGLE = 10;
export const MAGNETIC_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315, 360];

export function pxToCm(px: number): string {
  return (px / PX_PER_CM).toFixed(1);
}

export function getNextLabel(counter: number): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const idx = counter;
  return letters[idx % 26] + (idx >= 26 ? Math.floor(idx / 26) : '');
}

export function pointLineDist(
  px: number, py: number,
  ax: number, ay: number,
  bx: number, by: number
): number {
  const dx = bx - ax;
  const dy = by - ay;
  if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay);
  const t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy);
  const clamped = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + clamped * dx), py - (ay + clamped * dy));
}

export function findNearPoint(
  pos: { x: number; y: number },
  points: PointData[],
  tol: number
): PointData | null {
  return (
    points.find((p) => Math.hypot(p.x - pos.x, p.y - pos.y) <= tol) ?? null
  );
}

export function findNearText(
  pos: { x: number; y: number },
  texts: { x: number; y: number }[],
  tol: number
): { x: number; y: number; id?: string } | null {
  for (const t of texts) {
    const dx = pos.x - t.x;
    const dy = pos.y - t.y;
    if (Math.abs(dx) < tol * 3 && Math.abs(dy) < tol) return t;
  }
  return null;
}

export function snapToMagneticAngle(
  from: PointData,
  to: { x: number; y: number }
): { x: number; y: number; snapped: boolean } {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  if (angle < 0) angle += 360;
  let closest = angle;
  let minDiff = SNAP_ANGLE;
  for (const t of MAGNETIC_ANGLES) {
    let d = Math.abs(angle - t);
    if (d > 180) d = 360 - d;
    if (d < minDiff) {
      minDiff = d;
      closest = t;
    }
  }
  if (minDiff < SNAP_ANGLE) {
    const dist = Math.hypot(dx, dy);
    const rad = (closest * Math.PI) / 180;
    return {
      x: from.x + dist * Math.cos(rad),
      y: from.y + dist * Math.sin(rad),
      snapped: true,
    };
  }
  return { x: to.x, y: to.y, snapped: false };
}

export function constrainToAxis(
  from: PointData,
  to: { x: number; y: number }
): { x: number; y: number } {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return Math.abs(dx) > Math.abs(dy)
    ? { x: from.x + dx, y: from.y }
    : { x: from.x, y: from.y + dy };
}

export function lineLineIntersection(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  p4: { x: number; y: number }
): { x: number; y: number } | null {
  const denom =
    (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(denom) < 0.0001) return null;
  const t =
    ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denom;
  const u =
    -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / denom;
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1)
    return {
      x: p1.x + t * (p2.x - p1.x),
      y: p1.y + t * (p2.y - p1.y),
    };
  return null;
}

export function lineCircleIntersections(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  center: { x: number; y: number },
  radius: number
): { x: number; y: number }[] {
  const results: { x: number; y: number }[] = [];
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const fx = p1.x - center.x;
  const fy = p1.y - center.y;
  const a = dx * dx + dy * dy;
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - radius * radius;
  let disc = b * b - 4 * a * c;
  if (disc < 0) return results;
  disc = Math.sqrt(disc);
  const t1 = (-b - disc) / (2 * a);
  const t2 = (-b + disc) / (2 * a);
  if (t1 >= 0 && t1 <= 1)
    results.push({ x: p1.x + t1 * dx, y: p1.y + t1 * dy });
  if (t2 >= 0 && t2 <= 1 && Math.abs(t1 - t2) > 0.001)
    results.push({ x: p1.x + t2 * dx, y: p1.y + t2 * dy });
  return results;
}

export function circleCircleIntersections(
  c1: { x: number; y: number },
  r1: number,
  c2: { x: number; y: number },
  r2: number
): { x: number; y: number }[] {
  const results: { x: number; y: number }[] = [];
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d > r1 + r2 || d < Math.abs(r1 - r2) || d === 0) return results;
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(r1 * r1 - a * a);
  const cx = c1.x + (a * dx) / d;
  const cy = c1.y + (a * dy) / d;
  results.push({ x: cx + (h * dy) / d, y: cy - (h * dx) / d });
  if (d !== r1 + r2 && d !== Math.abs(r1 - r2))
    results.push({ x: cx - (h * dy) / d, y: cy + (h * dx) / d });
  return results;
}

export function isPointOnArc(
  point: { x: number; y: number },
  arc: { center: { x: number; y: number }; startAngle: number; endAngle: number }
): boolean {
  let angle =
    Math.atan2(
      -(point.y - arc.center.y),
      point.x - arc.center.x
    ) *
    (180 / Math.PI);
  if (angle < 0) angle += 360;
  let start = arc.startAngle;
  let end = arc.endAngle;
  if (start < 0) start += 360;
  if (end < 0) end += 360;
  if (end < start) end += 360;
  return angle >= start && angle <= end;
}
