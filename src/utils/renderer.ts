import type { ArcData, IntersectionData, LineData, PointData, RayData, TextData } from '../types';
import {
  pxToCm,
  lineLineIntersection,
  lineCircleIntersections,
  circleCircleIntersections,
  isPointOnArc,
} from './geometry';

export function renderLineLabel(
  line: LineData,
  pa: PointData,
  pb: PointData,
  labelPositions: Record<string, { x: number; y: number }>
): { x: number; y: number; text: string } {
  const distPx = Math.hypot(pb.x - pa.x, pb.y - pa.y);
  const distCm = pxToCm(distPx);
  const defaultX = (pa.x + pb.x) / 2;
  const defaultY = (pa.y + pb.y) / 2 - 18;
  const pos = labelPositions[line.id] ?? { x: defaultX, y: defaultY };
  return { x: pos.x, y: pos.y, text: `${distCm} cm` };
}

export function renderRayLabel(
  ray: RayData,
  pf: PointData,
  pt: PointData,
  labelPositions: Record<string, { x: number; y: number }>
): { x: number; y: number; text: string } {
  const midX = (pf.x + pt.x) / 2;
  const midY = (pf.y + pt.y) / 2;
  const angle = Math.atan2(-(pt.y - pf.y), pt.x - pf.x) * (180 / Math.PI);
  const normAngle = angle < 0 ? angle + 360 : angle;
  const pos = labelPositions[ray.id] ?? { x: midX, y: midY - 18 };
  return { x: pos.x, y: pos.y, text: `${normAngle.toFixed(0)}°` };
}

export function renderArcLabel(
  arc: ArcData,
  labelPositions: Record<string, { x: number; y: number }>
): { x: number; y: number; text: string } {
  const rCm = pxToCm(arc.radius);
  let defaultX: number;
  let defaultY: number;
  if (arc.type === 'circle') {
    defaultX = arc.center.x + arc.radius + 8;
    defaultY = arc.center.y - 8;
  } else {
    const midRad =
      ((arc.startAngle + arc.endAngle) / 2) * (Math.PI / 180);
    defaultX = arc.center.x + (arc.radius + 15) * Math.cos(midRad);
    defaultY = arc.center.y - (arc.radius + 15) * Math.sin(midRad);
  }
  const pos = labelPositions[arc.id] ?? { x: defaultX, y: defaultY };
  return { x: pos.x, y: pos.y, text: `r = ${rCm} cm` };
}

export function generateArcPath(arc: ArcData): string {
  if (arc.type === 'circle') return '';
  const startRad = (arc.startAngle * Math.PI) / 180;
  const endRad = (arc.endAngle * Math.PI) / 180;
  const sx =
    arc.center.x + arc.radius * Math.cos(startRad);
  const sy =
    arc.center.y - arc.radius * Math.sin(startRad);
  const ex = arc.center.x + arc.radius * Math.cos(endRad);
  const ey = arc.center.y - arc.radius * Math.sin(endRad);
  let sweep = arc.endAngle - arc.startAngle;
  if (sweep < 0) sweep += 360;
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${arc.radius} ${arc.radius} 0 ${largeArc} 0 ${ex} ${ey}`;
}

function isPointOnSegment(
  pt: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number },
  tol: number
): boolean {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(pt.x - a.x, pt.y - a.y) <= tol;
  const t = ((pt.x - a.x) * dx + (pt.y - a.y) * dy) / len2;
  if (t < 0 || t > 1) return false;
  const cx = a.x + t * dx;
  const cy = a.y + t * dy;
  return Math.hypot(pt.x - cx, pt.y - cy) <= tol;
}

function isPointOnRayPath(
  pt: { x: number; y: number },
  from: { x: number; y: number },
  to: { x: number; y: number },
  tol: number
): boolean {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(pt.x - from.x, pt.y - from.y) <= tol;
  const t = ((pt.x - from.x) * dx + (pt.y - from.y) * dy) / len2;
  if (t < 0) return false;
  const cx = from.x + t * dx;
  const cy = from.y + t * dy;
  return Math.hypot(pt.x - cx, pt.y - cy) <= tol;
}

function addUnique(results: { x: number; y: number }[], pt: { x: number; y: number }): void {
  const tol = 1;
  for (const r of results) {
    if (Math.abs(r.x - pt.x) < tol && Math.abs(r.y - pt.y) < tol) return;
  }
  results.push({ x: pt.x, y: pt.y });
}

export function findIntersections(
  lines: LineData[],
  rays: RayData[],
  arcs: ArcData[],
  points: PointData[]
): { x: number; y: number }[] {
  const results: { x: number; y: number }[] = [];
  const tol = 2;

  // ---- Geometric crossings ----

  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const la = lines[i], lb = lines[j];
      const p1 = points.find((p) => p.id === la.a);
      const p2 = points.find((p) => p.id === la.b);
      const p3 = points.find((p) => p.id === lb.a);
      const p4 = points.find((p) => p.id === lb.b);
      if (!p1 || !p2 || !p3 || !p4) continue;
      const inter = lineLineIntersection(p1, p2, p3, p4);
      if (inter) addUnique(results, inter);
    }
  }

  for (let i = 0; i < rays.length; i++) {
    for (let j = i + 1; j < rays.length; j++) {
      const ra = rays[i], rb = rays[j];
      const af = points.find((p) => p.id === ra.from);
      const at = points.find((p) => p.id === ra.to);
      const bf = points.find((p) => p.id === rb.from);
      const bt = points.find((p) => p.id === rb.to);
      if (!af || !at || !bf || !bt) continue;
      const inter = lineLineIntersection(af, at, bf, bt);
      if (inter) addUnique(results, inter);
    }
  }

  for (let i = 0; i < rays.length; i++) {
    for (let j = 0; j < lines.length; j++) {
      const ray = rays[i], line = lines[j];
      const pf = points.find((p) => p.id === ray.from);
      const pt = points.find((p) => p.id === ray.to);
      const pa = points.find((p) => p.id === line.a);
      const pb = points.find((p) => p.id === line.b);
      if (!pf || !pt || !pa || !pb) continue;
      const inter = lineLineIntersection(pf, pt, pa, pb);
      if (inter) addUnique(results, inter);
    }
  }

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < arcs.length; j++) {
      const line = lines[i], arc = arcs[j];
      const p1 = points.find((p) => p.id === line.a);
      const p2 = points.find((p) => p.id === line.b);
      if (!p1 || !p2) continue;
      const hits = lineCircleIntersections(p1, p2, arc.center, arc.radius);
      for (const hit of hits) {
        if (arc.type === 'arc' && !isPointOnArc(hit, arc)) continue;
        addUnique(results, hit);
      }
    }
  }

  for (let i = 0; i < rays.length; i++) {
    for (let j = 0; j < arcs.length; j++) {
      const ray = rays[i], arc = arcs[j];
      const pf = points.find((p) => p.id === ray.from);
      const pt = points.find((p) => p.id === ray.to);
      if (!pf || !pt) continue;
      const hits = lineCircleIntersections(pf, pt, arc.center, arc.radius);
      for (const hit of hits) {
        if (arc.type === 'arc' && !isPointOnArc(hit, arc)) continue;
        const rayDirX = pt.x - pf.x;
        const rayDirY = pt.y - pf.y;
        const hitT = ((hit.x - pf.x) * rayDirX + (hit.y - pf.y) * rayDirY) / (rayDirX * rayDirX + rayDirY * rayDirY);
        if (hitT >= 0) addUnique(results, hit);
      }
    }
  }

  for (let i = 0; i < arcs.length; i++) {
    for (let j = i + 1; j < arcs.length; j++) {
      const hits = circleCircleIntersections(
        arcs[i].center, arcs[i].radius,
        arcs[j].center, arcs[j].radius
      );
      for (const hit of hits) {
        const on1 = arcs[i].type === 'circle' || isPointOnArc(hit, arcs[i]);
        const on2 = arcs[j].type === 'circle' || isPointOnArc(hit, arcs[j]);
        if (on1 && on2) addUnique(results, hit);
      }
    }
  }

  // ---- Connection / shared-point detection ----
  // Points that lie on lines, rays, or arcs (beyond their own endpoints)

  for (const pt of points) {
    // Check lines
    for (const line of lines) {
      if (line.a === pt.id || line.b === pt.id) continue;
      const pa = points.find((p) => p.id === line.a);
      const pb = points.find((p) => p.id === line.b);
      if (!pa || !pb) continue;
      if (isPointOnSegment(pt, pa, pb, tol)) {
        addUnique(results, pt);
        break;
      }
    }
    // Check rays
    for (const ray of rays) {
      if (ray.from === pt.id || ray.to === pt.id) continue;
      const pf = points.find((p) => p.id === ray.from);
      const pt2 = points.find((p) => p.id === ray.to);
      if (!pf || !pt2) continue;
      if (isPointOnRayPath(pt, pf, pt2, tol)) {
        addUnique(results, pt);
        break;
      }
    }
    // Check arcs
    for (const arc of arcs) {
      if (arc.center.id === pt.id) continue;
      const dx = pt.x - arc.center.x;
      const dy = pt.y - arc.center.y;
      const dist = Math.hypot(dx, dy);
      if (Math.abs(dist - arc.radius) > tol) continue;
      if (arc.type === 'arc' && !isPointOnArc(pt, arc)) continue;
      addUnique(results, pt);
    }
  }

  return results;
}

export function exportSVG(
  points: PointData[],
  lines: LineData[],
  rays: RayData[],
  arcs: ArcData[]
): string {
  const lineEls = lines
    .map((l) => {
      const pa = points.find((p) => p.id === l.a);
      const pb = points.find((p) => p.id === l.b);
      if (!pa || !pb) return '';
      return `<line x1="${pa.x}" y1="${pa.y}" x2="${pb.x}" y2="${pb.y}" stroke="#60a5fa" stroke-width="2.5"/>`;
    })
    .join('\n');

  const rayEls = rays
    .map((r) => {
      const pf = points.find((p) => p.id === r.from);
      const pt = points.find((p) => p.id === r.to);
      if (!pf || !pt) return '';
      return `<line x1="${pf.x}" y1="${pf.y}" x2="${pt.x}" y2="${pt.y}" stroke="#f59e0b" stroke-width="2.5"/>`;
    })
    .join('\n');

  const arcEls = arcs
    .map((a) => {
      if (a.type === 'circle') {
        return `<circle cx="${a.center.x}" cy="${a.center.y}" r="${a.radius}" fill="none" stroke="#f472b6" stroke-width="2" stroke-dasharray="8 4"/>`;
      }
      const sr = (a.startAngle * Math.PI) / 180;
      const er = (a.endAngle * Math.PI) / 180;
      const sx = a.center.x + a.radius * Math.cos(sr);
      const sy = a.center.y - a.radius * Math.sin(sr);
      const ex = a.center.x + a.radius * Math.cos(er);
      const ey = a.center.y - a.radius * Math.sin(er);
      let sw = a.endAngle - a.startAngle;
      if (sw < 0) sw += 360;
      const la = sw > 180 ? 1 : 0;
      return `<path d="M ${sx} ${sy} A ${a.radius} ${a.radius} 0 ${la} 0 ${ex} ${ey}" fill="none" stroke="#f472b6" stroke-width="2"/>`;
    })
    .join('\n');

  const pointEls = points
    .map(
      (p) =>
        `<circle cx="${p.x}" cy="${p.y}" r="5" fill="#34d399"/><text x="${p.x + 12}" y="${p.y - 8}" font-size="13" fill="#e2e8f0" font-family="Georgia">${p.label}</text>`
    )
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="600" viewBox="0 0 1000 600">
  <rect width="100%" height="100%" fill="#0d1117"/>
  ${lineEls}
  ${rayEls}
  ${arcEls}
  ${pointEls}
</svg>`;
}
