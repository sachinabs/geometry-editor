import { useRef, useEffect, useState } from 'react';
import { useGeometryStore } from '../store/useGeometryStore';
import {
  findNearPoint,
  snapToMagneticAngle,
  constrainToAxis,
  pxToCm,
} from '../utils/geometry';
import { renderLineLabel, renderRayLabel, renderArcLabel, generateArcPath } from '../utils/renderer';
import type { PointData, LineData, RayData, ArcData, TextData, CompassSelection } from '../types';
import { InstructionBar } from './InstructionBar';
import { TextInputOverlay } from './TextInputOverlay';

const NS = 'http://www.w3.org/2000/svg';

function renumberSteps(steps: { num: number; text: string; elementIds?: string[] }[]) {
  return steps.map((s, i) => ({ ...s, num: i + 1 }));
}

function rebuildStepIndex(
  points: PointData[],
  lines: LineData[],
  rays: RayData[],
  arcs: ArcData[],
  texts: TextData[],
  steps: { elementIds?: string[] }[]
) {
  const hasElementIds = steps.some((s) => s.elementIds && s.elementIds.length > 0);
  if (!hasElementIds) {
    return { points, lines, rays, arcs, texts };
  }
  const elemToStep = new Map<string, number>();
  steps.forEach((s, idx) => {
    if (s.elementIds) s.elementIds.forEach((id) => elemToStep.set(id, idx));
  });
  return {
    points: points.map((p) => ({ ...p, stepIndex: elemToStep.get(p.id) })),
    lines: lines.map((l) => ({ ...l, stepIndex: elemToStep.get(l.id) })),
    rays: rays.map((r) => ({ ...r, stepIndex: elemToStep.get(r.id) })),
    arcs: arcs.map((a) => ({ ...a, stepIndex: elemToStep.get(a.id) })),
    texts: texts.map((t) => ({ ...t, stepIndex: elemToStep.get(t.id) })),
  };
}

export function CanvasView({ showInstructionBar = true }: { showInstructionBar?: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const viewportRef = useRef<SVGGElement>(null);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const panRef = useRef({ panX: 0, panY: 0, zoom: 1 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const isPanningRef = useRef(false);
  const [textInputPos, setTextInputPos] = useState<{ x: number; y: number } | null>(null);
  const [textEditingId, setTextEditingId] = useState<string | null>(null);

  const draggingLabelRef = useRef<string | null>(null);
  const draggingPointRef = useRef<PointData | null>(null);
  const dragPointOriginalRef = useRef<{ x: number; y: number } | null>(null);
  const draggingTextRef = useRef<{ id: string; origX: number; origY: number; startWorldX: number; startWorldY: number } | null>(null);
  const draggingSelectionRef = useRef(false);
  const dragSelectionStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragSelectionOriginsRef = useRef<Record<string, { x: number; y: number }>>({});
  const wasDraggedRef = useRef(false);

  const store = useGeometryStore();

  const updateTransform = () => {
    const vp = viewportRef.current;
    if (vp) {
      vp.setAttribute('transform', `translate(${panRef.current.panX}, ${panRef.current.panY}) scale(${panRef.current.zoom})`);
    }
  };

  const getNextLabel = () => {
    const s = useGeometryStore.getState();
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const idx = s.labelCounter;
    useGeometryStore.setState({ labelCounter: idx + 1 });
    return letters[idx % 26] + (idx >= 26 ? Math.floor(idx / 26) : '');
  };

  const screenToWorld = (sx: number, sy: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (sx - rect.left - panRef.current.panX) / panRef.current.zoom,
      y: (sy - rect.top - panRef.current.panY) / panRef.current.zoom,
    };
  };

  const renderPreview = (from: PointData, to: { x: number; y: number }) => {
    const preview = document.getElementById('previewGroup');
    if (!preview) return;
    preview.innerHTML = '';
    const distPx = Math.hypot(to.x - from.x, to.y - from.y);
    const distCm = pxToCm(distPx);
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const l = document.createElementNS(NS, 'line');
    l.setAttribute('x1', String(from.x)); l.setAttribute('y1', String(from.y));
    l.setAttribute('x2', String(to.x)); l.setAttribute('y2', String(to.y));
    l.setAttribute('stroke', '#60a5fa'); l.setAttribute('stroke-width', '2');
    l.setAttribute('stroke-dasharray', '6 4'); l.setAttribute('opacity', '0.6');
    preview.appendChild(l);
    const text = document.createElementNS(NS, 'text');
    text.setAttribute('x', String(midX)); text.setAttribute('y', String(midY - 8));
    text.setAttribute('font-size', '12'); text.setAttribute('font-family', 'system-ui, sans-serif');
    text.setAttribute('font-weight', '600'); text.setAttribute('fill', '#60a5fa');
    text.setAttribute('text-anchor', 'middle'); text.setAttribute('pointer-events', 'none');
    text.textContent = `${distCm} cm`;
    preview.appendChild(text);
  };

  const renderProtractorPreview = (from: PointData, pos: { x: number; y: number }) => {
    const preview = document.getElementById('previewGroup');
    if (!preview) return;
    preview.innerHTML = '';
    const angle = Math.atan2(-(pos.y - from.y), pos.x - from.x) * (180 / Math.PI);
    const normAngle = angle < 0 ? angle + 360 : angle;
    const rad = (normAngle * Math.PI) / 180;
    const ex = from.x + 200 * Math.cos(rad);
    const ey = from.y - 200 * Math.sin(rad);
    const l = document.createElementNS(NS, 'line');
    l.setAttribute('x1', String(from.x)); l.setAttribute('y1', String(from.y));
    l.setAttribute('x2', String(ex)); l.setAttribute('y2', String(ey));
    l.setAttribute('stroke', '#f59e0b'); l.setAttribute('stroke-width', '2');
    l.setAttribute('stroke-dasharray', '6 4'); l.setAttribute('opacity', '0.5');
    preview.appendChild(l);
    const text = document.createElementNS(NS, 'text');
    text.setAttribute('x', String(from.x + 55 * Math.cos(rad / 2)));
    text.setAttribute('y', String(from.y - 55 * Math.sin(rad / 2)));
    text.setAttribute('font-size', '12'); text.setAttribute('font-weight', '600');
    text.setAttribute('fill', '#f59e0b'); text.setAttribute('text-anchor', 'middle');
    text.setAttribute('pointer-events', 'none');
    text.textContent = `${normAngle.toFixed(0)}\u00b0`;
    preview.appendChild(text);
  };

  const renderCompassRadiusPreview = (center: PointData, radiusPos: { x: number; y: number }) => {
    const preview = document.getElementById('previewGroup');
    if (!preview) return;
    preview.innerHTML = '';
    const radius = Math.hypot(radiusPos.x - center.x, radiusPos.y - center.y);
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', String(center.x)); c.setAttribute('cy', String(center.y));
    c.setAttribute('r', String(radius)); c.setAttribute('fill', 'none');
    c.setAttribute('stroke', '#f472b6'); c.setAttribute('stroke-width', '2');
    c.setAttribute('stroke-dasharray', '6 4'); c.setAttribute('opacity', '0.6');
    preview.appendChild(c);
    const rCm = pxToCm(radius);
    const text = document.createElementNS(NS, 'text');
    text.setAttribute('x', String(center.x + radius + 8)); text.setAttribute('y', String(center.y - 8));
    text.setAttribute('font-size', '12'); text.setAttribute('font-weight', '600');
    text.setAttribute('fill', '#f472b6'); text.setAttribute('pointer-events', 'none');
    text.textContent = `r = ${rCm} cm`;
    preview.appendChild(text);
  };

  const renderCompassStartPreview = (center: PointData, radius: number, pos: { x: number; y: number }) => {
    const preview = document.getElementById('previewGroup');
    if (!preview) return;
    preview.innerHTML = '';
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', String(center.x)); c.setAttribute('cy', String(center.y));
    c.setAttribute('r', String(radius)); c.setAttribute('fill', 'none');
    c.setAttribute('stroke', '#f472b6'); c.setAttribute('stroke-width', '1.5');
    c.setAttribute('stroke-dasharray', '4 4'); c.setAttribute('opacity', '0.4');
    preview.appendChild(c);
    const angle = Math.atan2(-(pos.y - center.y), pos.x - center.x) * (180 / Math.PI);
    const startAngle = angle < 0 ? angle + 360 : angle;
    const startRad = startAngle * Math.PI / 180;
    const sx = center.x + radius * Math.cos(startRad);
    const sy = center.y - radius * Math.sin(startRad);
    const marker = document.createElementNS(NS, 'circle');
    marker.setAttribute('cx', String(sx)); marker.setAttribute('cy', String(sy));
    marker.setAttribute('r', '6'); marker.setAttribute('fill', '#f472b6'); marker.setAttribute('opacity', '0.8');
    preview.appendChild(marker);
  };

  const renderCompassArcPreview = (center: PointData, radius: number, startAngle: number, pos: { x: number; y: number }) => {
    const preview = document.getElementById('previewGroup');
    if (!preview) return;
    preview.innerHTML = '';
    const endAngle = Math.atan2(-(pos.y - center.y), pos.x - center.x) * (180 / Math.PI);
    const endAngleNorm = endAngle < 0 ? endAngle + 360 : endAngle;
    const startRad = startAngle * Math.PI / 180;
    const endRad = endAngleNorm * Math.PI / 180;
    const sx = center.x + radius * Math.cos(startRad);
    const sy = center.y - radius * Math.sin(startRad);
    const ex = center.x + radius * Math.cos(endRad);
    const ey = center.y - radius * Math.sin(endRad);
    let sweep = endAngleNorm - startAngle;
    if (sweep < 0) sweep += 360;
    const largeArc = sweep > 180 ? 1 : 0;
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', `M ${sx} ${sy} A ${radius} ${radius} 0 ${largeArc} 0 ${ex} ${ey}`);
    path.setAttribute('fill', 'none'); path.setAttribute('stroke', '#f472b6');
    path.setAttribute('stroke-width', '3'); path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('opacity', '0.7');
    preview.appendChild(path);
    const endMarker = document.createElementNS(NS, 'circle');
    endMarker.setAttribute('cx', String(ex)); endMarker.setAttribute('cy', String(ey));
    endMarker.setAttribute('r', '6'); endMarker.setAttribute('fill', '#f472b6'); endMarker.setAttribute('opacity', '0.8');
    preview.appendChild(endMarker);
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      if (Math.abs(e.deltaY) < 8) return;
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      const { panX, panY, zoom } = panRef.current;
      const newZoom = Math.max(0.1, Math.min(5, zoom + delta));
      const newPanX = mx - (mx - panX) * (newZoom / zoom);
      const newPanY = my - (my - panY) * (newZoom / zoom);
      panRef.current = { panX: newPanX, panY: newPanY, zoom: newZoom };
      setPanX(newPanX); setPanY(newPanY); setZoom(newZoom);
      updateTransform();
    };

    const handleMouseDown = (e: MouseEvent) => {
      const st = useGeometryStore.getState();
      if (e.button === 1 || (e.button === 0 && e.altKey) || st.currentTool === 'hand') {
        e.preventDefault();
        isPanningRef.current = true;
        panStartRef.current = { x: e.clientX - panRef.current.panX, y: e.clientY - panRef.current.panY };
        svg.style.cursor = 'grabbing';
        return;
      }

      if (st.currentTool === 'move' && !st.playbackActive) {
        const label = (e.target as Element).closest?.('.measure-label');
        if (label) {
          e.preventDefault();
          e.stopPropagation();
          draggingLabelRef.current = label.getAttribute('data-id');
          svg.style.cursor = 'grabbing';
          return;
        }

        const pos = screenToWorld(e.clientX, e.clientY);
        const nearPt = findNearPoint(pos, st.points, 12 / panRef.current.zoom);

        if (st.selectedIds.size > 0 && nearPt && st.selectedIds.has(nearPt.id)) {
          e.preventDefault();
          e.stopPropagation();
          draggingSelectionRef.current = true;
          dragSelectionStartRef.current = { x: pos.x, y: pos.y };
          dragSelectionOriginsRef.current = {};
          st.points.filter(p => st.selectedIds.has(p.id)).forEach(p => {
            dragSelectionOriginsRef.current[p.id] = { x: p.x, y: p.y };
          });
          st.texts.filter(t => st.selectedIds.has(t.id)).forEach(t => {
            dragSelectionOriginsRef.current[t.id] = { x: t.x, y: t.y };
          });
          svg.style.cursor = 'grabbing';
          return;
        }

        if (nearPt) {
          e.preventDefault();
          e.stopPropagation();
          draggingPointRef.current = nearPt;
          dragPointOriginalRef.current = { x: nearPt.x, y: nearPt.y };
          svg.style.cursor = 'grabbing';
          return;
        }

        const nearText = st.texts.find(t =>
          Math.abs(pos.x - t.x) < 30 && Math.abs(pos.y - t.y) < 15
        );
        if (nearText) {
          e.preventDefault();
          e.stopPropagation();
          draggingTextRef.current = { id: nearText.id, origX: nearText.x, origY: nearText.y, startWorldX: pos.x, startWorldY: pos.y };
          svg.style.cursor = 'grabbing';
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isPanningRef.current) {
        panRef.current.panX = e.clientX - panStartRef.current.x;
        panRef.current.panY = e.clientY - panStartRef.current.y;
        setPanX(panRef.current.panX); setPanY(panRef.current.panY);
        updateTransform();
        return;
      }

      if (draggingLabelRef.current) {
        const pos = screenToWorld(e.clientX, e.clientY);
        useGeometryStore.getState().setLabelPosition(draggingLabelRef.current!, { x: pos.x, y: pos.y });
        return;
      }

      if (draggingPointRef.current) {
        const pos = screenToWorld(e.clientX, e.clientY);
        const pt = draggingPointRef.current;
        if (Math.abs(pos.x - dragPointOriginalRef.current!.x) > 2 || Math.abs(pos.y - dragPointOriginalRef.current!.y) > 2) {
          wasDraggedRef.current = true;
        }
        useGeometryStore.getState().updatePoint(pt.id, pos.x, pos.y);
        return;
      }

      if (draggingTextRef.current) {
        const pos = screenToWorld(e.clientX, e.clientY);
        wasDraggedRef.current = true;
        const dt = draggingTextRef.current;
        useGeometryStore.getState().updateTextPosition(dt.id, dt.origX + (pos.x - dt.startWorldX), dt.origY + (pos.y - dt.startWorldY));
        return;
      }

      if (draggingSelectionRef.current && dragSelectionStartRef.current) {
        const pos = screenToWorld(e.clientX, e.clientY);
        const dx = pos.x - dragSelectionStartRef.current.x;
        const dy = pos.y - dragSelectionStartRef.current.y;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) wasDraggedRef.current = true;
        const st = useGeometryStore.getState();
        const origins = dragSelectionOriginsRef.current;
        st.points.filter(p => st.selectedIds.has(p.id) && origins[p.id]).forEach(p => {
          useGeometryStore.getState().updatePoint(p.id, origins[p.id].x + dx, origins[p.id].y + dy);
        });
        st.texts.filter(t => st.selectedIds.has(t.id) && origins[t.id]).forEach(t => {
          useGeometryStore.getState().updateTextPosition(t.id, origins[t.id].x + dx, origins[t.id].y + dy);
        });
        const preview = document.getElementById('previewGroup');
        if (preview) {
          preview.innerHTML = '';
          const selPoints = st.points.filter(p => st.selectedIds.has(p.id) && origins[p.id]);
          if (selPoints.length > 0) {
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            selPoints.forEach(p => { minX = Math.min(minX, p.x + dx); minY = Math.min(minY, p.y + dy); maxX = Math.max(maxX, p.x + dx); maxY = Math.max(maxY, p.y + dy); });
            st.texts.filter(t => st.selectedIds.has(t.id) && origins[t.id]).forEach(t => {
              minX = Math.min(minX, origins[t.id].x + dx); minY = Math.min(minY, origins[t.id].y + dy - 14);
              maxX = Math.max(maxX, origins[t.id].x + dx + 100); maxY = Math.max(maxY, origins[t.id].y + dy + 4);
            });
            const rect = document.createElementNS(NS, 'rect');
            rect.setAttribute('x', String(minX - 20)); rect.setAttribute('y', String(minY - 20));
            rect.setAttribute('width', String(maxX - minX + 40)); rect.setAttribute('height', String(maxY - minY + 40));
            rect.setAttribute('fill', 'none'); rect.setAttribute('stroke', '#0ea5a9');
            rect.setAttribute('stroke-width', '2'); rect.setAttribute('stroke-dasharray', '6 4');
            rect.setAttribute('rx', '6'); rect.setAttribute('opacity', '0.5');
            preview.appendChild(rect);
          }
        }
        return;
      }

      const preview = document.getElementById('previewGroup');
      if (preview) preview.innerHTML = '';

      const st = useGeometryStore.getState();
      const pos = screenToWorld(e.clientX, e.clientY);
      const wx = Math.round(pos.x / 20) * 20;
      const wy = Math.round(pos.y / 20) * 20;

      if (st.currentTool === 'ruler' && st.selection.length === 1) {
        const from = st.selection[0] as PointData;
        let endPos = { x: pos.x, y: pos.y };
        if (e.shiftKey) {
          endPos = constrainToAxis(from, endPos);
        } else {
          const r = snapToMagneticAngle(from, endPos);
          if (r.snapped) endPos = { x: r.x, y: r.y };
        }
        renderPreview(from, endPos);
      } else if (st.currentTool === 'protractor' && st.selection.length === 1) {
        renderProtractorPreview(st.selection[0] as PointData, pos);
      } else if (st.currentTool === 'compass') {
        if (st.selection.length === 1) {
          const center = st.selection[0] as PointData;
          let radiusPos = { x: pos.x, y: pos.y };
          if (e.shiftKey) {
            radiusPos = constrainToAxis(center, radiusPos);
          } else {
            const r = snapToMagneticAngle(center, radiusPos);
            if (r.snapped) radiusPos = { x: r.x, y: r.y };
          }
          renderCompassRadiusPreview(center, radiusPos);
        } else if (st.selection.length === 2) {
          const center = st.selection[0] as PointData;
          const radius = (st.selection[1] as CompassSelection).radius!;
          renderCompassStartPreview(center, radius, pos);
        } else if (st.selection.length === 3) {
          const center = st.selection[0] as PointData;
          const radius = (st.selection[1] as CompassSelection).radius!;
          const startAngle = (st.selection[2] as CompassSelection).startAngle!;
          renderCompassArcPreview(center, radius, startAngle, pos);
        }
      }
    };

    const handleMouseUp = () => {
      if (isPanningRef.current) {
        isPanningRef.current = false;
        const st = useGeometryStore.getState();
        svg.style.cursor = st.currentTool === 'move' ? 'move' : st.currentTool === 'hand' ? 'grab' : 'crosshair';
        return;
      }
      if (draggingLabelRef.current) {
        draggingLabelRef.current = null;
        useGeometryStore.getState().pushSnapshot();
        svg.style.cursor = 'move';
        return;
      }
      if (draggingTextRef.current) {
        if (wasDraggedRef.current) useGeometryStore.getState().pushSnapshot();
        draggingTextRef.current = null;
        svg.style.cursor = 'move';
        setTimeout(() => { wasDraggedRef.current = false; }, 50);
        return;
      }
      if (draggingPointRef.current) {
        if (wasDraggedRef.current) useGeometryStore.getState().pushSnapshot();
        draggingPointRef.current = null;
        dragPointOriginalRef.current = null;
        svg.style.cursor = 'move';
        setTimeout(() => { wasDraggedRef.current = false; }, 50);
        return;
      }
      if (draggingSelectionRef.current) {
        if (wasDraggedRef.current) useGeometryStore.getState().pushSnapshot();
        draggingSelectionRef.current = false;
        dragSelectionStartRef.current = null;
        dragSelectionOriginsRef.current = {};
        const preview = document.getElementById('previewGroup');
        if (preview) preview.innerHTML = '';
        svg.style.cursor = 'move';
        setTimeout(() => { wasDraggedRef.current = false; }, 50);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const st = useGeometryStore.getState();
      if (isPanningRef.current || st.currentTool === 'hand' || wasDraggedRef.current) return;
      const pos = screenToWorld(e.clientX, e.clientY);
      const nearPoint = findNearPoint(pos, st.points, 12 / panRef.current.zoom);

      switch (st.currentTool) {
        case 'ruler': {
          if (st.selection.length === 0) {
            const pt: PointData = nearPoint ?? {
              id: 'p' + Date.now(), x: pos.x, y: pos.y, label: getNextLabel(), stepIndex: st.steps.length,
            };
            if (!nearPoint) {
              const ptStep = { num: st.stepCounter + 1, text: `Placed point ${pt.label}`, elementIds: [pt.id] };
              useGeometryStore.setState({
                points: [...st.points, pt],
                steps: [...st.steps, ptStep],
                stepCounter: st.stepCounter + 1,
              });
            }
            useGeometryStore.setState({ selection: [pt] });
          } else {
            let endPt: PointData;
            if (nearPoint) {
              endPt = nearPoint;
            } else {
              let endPos = { x: pos.x, y: pos.y };
              if (e.shiftKey) endPos = constrainToAxis(st.selection[0] as PointData, endPos);
              else { const r = snapToMagneticAngle(st.selection[0] as PointData, endPos); if (r.snapped) endPos = { x: r.x, y: r.y }; }
              endPt = { id: 'p' + Date.now(), x: endPos.x, y: endPos.y, label: getNextLabel(), stepIndex: st.steps.length };
            }
            const distPx = Math.hypot(endPt.x - (st.selection[0] as PointData).x, endPt.y - (st.selection[0] as PointData).y);
            const distCm = pxToCm(distPx);
            const lineId = 'l' + Date.now();
            const lineStepNum = st.stepCounter + 1;
            const lineStep = { num: lineStepNum, text: `Line drawn from ${(st.selection[0] as PointData).label} to ${endPt.label} = ${distCm} cm`, elementIds: [lineId] };
            const newPoints = nearPoint ? st.points : [...st.points, endPt];
            useGeometryStore.setState({
              points: newPoints,
              lines: [...st.lines, { id: lineId, a: (st.selection[0] as PointData).id, b: endPt.id, stepIndex: st.steps.length }],
              steps: [...st.steps, lineStep],
              stepCounter: lineStepNum,
              selection: [],
              statusMessage: 'Line drawn! Click to start another.',
              statusIsError: false,
            });
            useGeometryStore.getState().pushSnapshot();
          }
          break;
        }
        case 'protractor': {
          if (st.selection.length === 0) {
            const pt: PointData = nearPoint ?? { id: 'p' + Date.now(), x: pos.x, y: pos.y, label: getNextLabel() };
            if (!nearPoint) {
              const si = st.steps.length;
              pt.stepIndex = si;
              const step = { num: st.stepCounter + 1, text: `Placed point ${pt.label}`, elementIds: [pt.id] };
              useGeometryStore.setState({
                points: [...st.points, pt],
                steps: [...st.steps, step],
                stepCounter: st.stepCounter + 1,
              });
            }
            useGeometryStore.setState({ selection: [pt] });
          } else {
            const center = st.selection[0] as PointData;
            const angle = Math.atan2(-(pos.y - center.y), pos.x - center.x) * (180 / Math.PI);
            const normAngle = angle < 0 ? angle + 360 : angle;
            const endPt: PointData = {
              id: 'p' + Date.now(),
              x: center.x + 200 * Math.cos(normAngle * Math.PI / 180),
              y: center.y - 200 * Math.sin(normAngle * Math.PI / 180),
              label: getNextLabel()
            };
            const rayId = 'r' + Date.now();
            const si = st.steps.length;
            endPt.stepIndex = si;
            const si2 = st.steps.length + 1;
            const ptStep = { num: st.stepCounter + 1, text: `Placed point ${endPt.label}`, elementIds: [endPt.id] };
            const rayStep = { num: st.stepCounter + 2, text: `Ray drawn from ${center.label} at ${normAngle.toFixed(0)}°`, elementIds: [rayId] };
            useGeometryStore.setState({
              points: [...st.points, endPt],
              rays: [...st.rays, { id: rayId, from: center.id, to: endPt.id, angle: normAngle, stepIndex: si2 }],
              steps: [...st.steps, ptStep, rayStep],
              stepCounter: st.stepCounter + 2,
              selection: [],
              statusMessage: 'Ray drawn! Click to place another protractor center.',
              statusIsError: false,
            });
            useGeometryStore.getState().pushSnapshot();
          }
          break;
        }
        case 'compass': {
          if (st.selection.length === 0) {
            const pt: PointData = nearPoint ?? { id: 'p' + Date.now(), x: pos.x, y: pos.y, label: getNextLabel() };
            if (!nearPoint) {
              const si = st.steps.length;
              pt.stepIndex = si;
              const step = { num: st.stepCounter + 1, text: `Placed compass center at ${pt.label}`, elementIds: [pt.id] };
              useGeometryStore.setState({
                points: [...st.points, pt],
                steps: [...st.steps, step],
                stepCounter: st.stepCounter + 1,
              });
            }
            useGeometryStore.setState({ selection: [pt] });
          } else if (st.selection.length === 1) {
            let radiusPos = { x: pos.x, y: pos.y };
            if (e.shiftKey) {
              radiusPos = constrainToAxis(st.selection[0] as PointData, radiusPos);
            } else {
              const r = snapToMagneticAngle(st.selection[0] as PointData, radiusPos);
              if (r.snapped) radiusPos = { x: r.x, y: r.y };
            }
            const radius = Math.hypot(radiusPos.x - (st.selection[0] as PointData).x, radiusPos.y - (st.selection[0] as PointData).y);
            useGeometryStore.setState({ selection: [...st.selection, { radius }] });
          } else if (st.selection.length === 2) {
            const angle = Math.atan2(-(pos.y - (st.selection[0] as PointData).y), pos.x - (st.selection[0] as PointData).x) * (180 / Math.PI);
            useGeometryStore.setState({ selection: [...st.selection, { startAngle: angle < 0 ? angle + 360 : angle }] });
          } else if (st.selection.length === 3) {
            const angle = Math.atan2(-(pos.y - (st.selection[0] as PointData).y), pos.x - (st.selection[0] as PointData).x) * (180 / Math.PI);
            const endAngle = angle < 0 ? angle + 360 : angle;
            const startAngle = (st.selection[2] as CompassSelection).startAngle!;
            const radiusCm = pxToCm((st.selection[1] as CompassSelection).radius!);
            const arcId = 'a' + Date.now();
            const arcStep = { num: st.stepCounter + 1, text: `Arc drawn from ${startAngle.toFixed(0)}° to ${endAngle.toFixed(0)}° with radius ${radiusCm} cm`, elementIds: [arcId] };
            useGeometryStore.setState({
              arcs: [...st.arcs, { id: arcId, center: { ...st.selection[0] as PointData }, radius: (st.selection[1] as CompassSelection).radius!, startAngle, endAngle, type: 'arc' as const, stepIndex: st.steps.length }],
              steps: [...st.steps, arcStep],
              stepCounter: st.stepCounter + 1,
              selection: [],
              statusMessage: 'Arc drawn!',
              statusIsError: false,
            });
            useGeometryStore.getState().pushSnapshot();
          }
          break;
        }
        case 'point': {
          if (!nearPoint) {
            const pt = { id: 'p' + Date.now(), x: pos.x, y: pos.y, label: getNextLabel(), stepIndex: st.steps.length };
            const ptStep = { num: st.stepCounter + 1, text: `Placed point ${pt.label}`, elementIds: [pt.id] };
            useGeometryStore.setState({
              points: [...st.points, pt],
              steps: [...st.steps, ptStep],
              stepCounter: st.stepCounter + 1,
              statusMessage: `Point ${pt.label} placed`,
              statusIsError: false,
            });
            useGeometryStore.getState().pushSnapshot();
          }
          break;
        }
        case 'text': {
          if (!st.playbackActive) {
            setTextInputPos({ x: pos.x, y: pos.y });
            setTextEditingId(null);
          }
          break;
        }
        case 'move': {
          if (!st.playbackActive) {
            const nearLine = st.lines.find(l => {
              const pa = st.points.find(p => p.id === l.a);
              const pb = st.points.find(p => p.id === l.b);
              if (!pa || !pb) return false;
              const dx = pb.x - pa.x, dy = pb.y - pa.y;
              const t = ((pos.x - pa.x) * dx + (pos.y - pa.y) * dy) / (dx * dx + dy * dy);
              const cx = pa.x + Math.max(0, Math.min(1, t)) * dx;
              const cy = pa.y + Math.max(0, Math.min(1, t)) * dy;
              return Math.hypot(pos.x - cx, pos.y - cy) <= 8 / panRef.current.zoom;
            });
            const nearRay = st.rays.find(r => {
              const pf = st.points.find(p => p.id === r.from);
              const pt = st.points.find(p => p.id === r.to);
              if (!pf || !pt) return false;
              const dx = pt.x - pf.x, dy = pt.y - pf.y;
              const t = ((pos.x - pf.x) * dx + (pos.y - pf.y) * dy) / (dx * dx + dy * dy);
              const cx = pf.x + Math.max(0, Math.min(1, t)) * dx;
              const cy = pf.y + Math.max(0, Math.min(1, t)) * dy;
              return Math.hypot(pos.x - cx, pos.y - cy) <= 8 / panRef.current.zoom;
            });
            const nearArc = st.arcs.find(a => {
              const d = Math.hypot(pos.x - a.center.x, pos.y - a.center.y);
              return Math.abs(d - a.radius) <= 8 / panRef.current.zoom;
            });
            const nearText = st.texts.find(t => {
              return Math.abs(pos.x - t.x) < 30 && Math.abs(pos.y - t.y) < 15;
            });
            if (!nearPoint && !nearLine && !nearRay && !nearArc && !nearText) {
              useGeometryStore.setState({ selectedIds: new Set() });
              break;
            }
            const newIds = new Set<string>();
            if (nearPoint) newIds.add(nearPoint.id);
            else if (nearLine) newIds.add(nearLine.id);
            else if (nearRay) newIds.add(nearRay.id);
            else if (nearArc) newIds.add(nearArc.id);
            else if (nearText) newIds.add(nearText.id);
            useGeometryStore.setState({ selectedIds: newIds });
          }
          break;
        }
        case 'eraser': {
          const hitPoint = findNearPoint(pos, st.points, 12 / panRef.current.zoom);
          if (hitPoint) {
            const allToDelete = new Set([hitPoint.id]);
            st.lines.filter(l => l.a === hitPoint.id || l.b === hitPoint.id).forEach(l => allToDelete.add(l.id));
            st.rays.filter(r => r.from === hitPoint.id || r.to === hitPoint.id).forEach(r => allToDelete.add(r.id));
            st.arcs.filter(a => a.center.id === hitPoint.id).forEach(a => allToDelete.add(a.id));
            const newSteps = renumberSteps(st.steps.filter(s => !s.elementIds || !s.elementIds.some(id => allToDelete.has(id))));
            const fp = st.points.filter(p => !allToDelete.has(p.id));
            const fl = st.lines.filter(l => !allToDelete.has(l.id) && !allToDelete.has(l.a) && !allToDelete.has(l.b));
            const fr = st.rays.filter(r => !allToDelete.has(r.id) && !allToDelete.has(r.from) && !allToDelete.has(r.to));
            const fa = st.arcs.filter(a => !allToDelete.has(a.id) && !(a.center && allToDelete.has(a.center.id)));
            const ft = st.texts.filter(t => !allToDelete.has(t.id));
            const rebuilt = rebuildStepIndex(fp, fl, fr, fa, ft, newSteps);
            useGeometryStore.setState({
              ...rebuilt,
              steps: newSteps,
              stepCounter: newSteps.length,
              statusMessage: `Erased point ${hitPoint.label}`,
              statusIsError: false,
            });
            useGeometryStore.getState().pushSnapshot();
          } else {
            const hitLine = st.lines.find(l => {
              const pa = st.points.find(p => p.id === l.a);
              const pb = st.points.find(p => p.id === l.b);
              if (!pa || !pb) return false;
              const dx = pb.x - pa.x, dy = pb.y - pa.y;
              const t = ((pos.x - pa.x) * dx + (pos.y - pa.y) * dy) / (dx * dx + dy * dy);
              const cx = pa.x + Math.max(0, Math.min(1, t)) * dx;
              const cy = pa.y + Math.max(0, Math.min(1, t)) * dy;
              return Math.hypot(pos.x - cx, pos.y - cy) <= 8 / panRef.current.zoom;
            });
            if (hitLine) {
              const deletedIds = new Set([hitLine.id]);
              const newSteps = renumberSteps(st.steps.filter(s => !s.elementIds || !s.elementIds.some(id => deletedIds.has(id))));
              const fl = st.lines.filter(l => l.id !== hitLine.id);
              const rebuilt = rebuildStepIndex(st.points, fl, st.rays, st.arcs, st.texts, newSteps);
              useGeometryStore.setState({ ...rebuilt, steps: newSteps, stepCounter: newSteps.length, statusMessage: 'Erased line', statusIsError: false });
              useGeometryStore.getState().pushSnapshot();
              break;
            }
            const hitRay = st.rays.find(r => {
              const pf = st.points.find(p => p.id === r.from);
              const pt = st.points.find(p => p.id === r.to);
              if (!pf || !pt) return false;
              const dx = pt.x - pf.x, dy = pt.y - pf.y;
              const t = ((pos.x - pf.x) * dx + (pos.y - pf.y) * dy) / (dx * dx + dy * dy);
              const cx = pf.x + Math.max(0, Math.min(1, t)) * dx;
              const cy = pf.y + Math.max(0, Math.min(1, t)) * dy;
              return Math.hypot(pos.x - cx, pos.y - cy) <= 8 / panRef.current.zoom;
            });
            if (hitRay) {
              const deletedIds = new Set([hitRay.id]);
              const newSteps = renumberSteps(st.steps.filter(s => !s.elementIds || !s.elementIds.some(id => deletedIds.has(id))));
              const fr = st.rays.filter(r => r.id !== hitRay.id);
              const rebuilt = rebuildStepIndex(st.points, st.lines, fr, st.arcs, st.texts, newSteps);
              useGeometryStore.setState({ ...rebuilt, steps: newSteps, stepCounter: newSteps.length, statusMessage: 'Erased ray', statusIsError: false });
              useGeometryStore.getState().pushSnapshot();
              break;
            }
            const hitArc = st.arcs.find(a => {
              const d = Math.hypot(pos.x - a.center.x, pos.y - a.center.y);
              return Math.abs(d - a.radius) <= 8 / panRef.current.zoom;
            });
            if (hitArc) {
              const deletedIds = new Set([hitArc.id]);
              const newSteps = renumberSteps(st.steps.filter(s => !s.elementIds || !s.elementIds.some(id => deletedIds.has(id))));
              const fa = st.arcs.filter(a => a.id !== hitArc.id);
              const rebuilt = rebuildStepIndex(st.points, st.lines, st.rays, fa, st.texts, newSteps);
              useGeometryStore.setState({ ...rebuilt, steps: newSteps, stepCounter: newSteps.length, statusMessage: 'Erased arc', statusIsError: false });
              useGeometryStore.getState().pushSnapshot();
              break;
            }
            const hitText = st.texts.find(t =>
              Math.abs(pos.x - t.x) < 30 && Math.abs(pos.y - t.y) < 15
            );
            if (hitText) {
              const deletedIds = new Set([hitText.id]);
              const newSteps = renumberSteps(st.steps.filter(s => !s.elementIds || !s.elementIds.some(id => deletedIds.has(id))));
              const ft = st.texts.filter(t => t.id !== hitText.id);
              const rebuilt = rebuildStepIndex(st.points, st.lines, st.rays, st.arcs, ft, newSteps);
              useGeometryStore.setState({ ...rebuilt, steps: newSteps, stepCounter: newSteps.length, statusMessage: 'Erased text', statusIsError: false });
              useGeometryStore.getState().pushSnapshot();
            }
          }
          break;
        }
        case 'intersect': {
          useGeometryStore.getState().findIntersectionsAction();
          break;
        }
      }
    };

    svg.addEventListener('wheel', handleWheel, { passive: false });
    svg.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    svg.addEventListener('click', handleClick);

    return () => {
      svg.removeEventListener('wheel', handleWheel);
      svg.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      svg.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    updateTransform();
  });

  const handleTextSubmit = (content: string) => {
    if (!content.trim()) return;
    const s = useGeometryStore.getState();
    if (textEditingId) {
      useGeometryStore.setState({ texts: s.texts.map(t => t.id === textEditingId ? { ...t, content: content.trim() } : t) });
    } else if (textInputPos) {
      const td: TextData = { id: 't' + Date.now(), x: textInputPos.x, y: textInputPos.y, content: content.trim(), fontSize: 14 };
      const textStep = { num: s.stepCounter + 1, text: `Added text "${content.trim().substring(0, 20)}${content.trim().length > 20 ? '...' : ''}"`, elementIds: [td.id] };
      useGeometryStore.setState({
        texts: [...s.texts, td],
        steps: [...s.steps, textStep],
        stepCounter: s.stepCounter + 1,
      });
      useGeometryStore.getState().pushSnapshot();
    }
    setTextInputPos(null);
    setTextEditingId(null);
  };

  const svgCurrentTool = useGeometryStore((s) => s.currentTool);

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#0d1117' }}>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <svg
          ref={svgRef}
          style={{ width: '100%', height: '100%', cursor: svgCurrentTool === 'move' ? 'move' : svgCurrentTool === 'hand' ? 'grab' : 'crosshair' }}
        >
          <defs>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#334155" strokeWidth="1" />
            </pattern>
          </defs>
          <g ref={viewportRef}>
            <rect x="-5000" y="-5000" width="10000" height="10000" fill="url(#grid)" />
            <SvgPoints />
            <SvgRays />
            <SvgLines />
            <SvgArcs />
            <SvgTexts />
            <SvgLabels />
            <SvgIntersections />
            <g id="previewGroup" />
          </g>
        </svg>
        <TextInputOverlay position={textInputPos} editId={textEditingId} onSubmit={handleTextSubmit} onCancel={() => { setTextInputPos(null); setTextEditingId(null); }} />
        {showInstructionBar && <InstructionBar />}
      </div>
    </div>
  );
}

function SvgPoints() {
  const points = useGeometryStore((s) => s.points);
  const selectedIds = useGeometryStore((s) => s.selectedIds);
  const playbackActive = useGeometryStore((s) => s.playbackActive);
  const playbackStep = useGeometryStore((s) => s.playbackStep);
  const dimStep = playbackActive ? playbackStep : -1;
  const isDimmed = playbackActive && dimStep >= 0;
  return (
    <g id="pointsGroup">
      {points.map((pt) => {
        const isSel = selectedIds.has(pt.id);
        const opacity = isDimmed && pt.stepIndex !== undefined && pt.stepIndex > dimStep ? 0 : 1;
        return (
          <g key={pt.id} opacity={opacity}>
            {isSel && <circle cx={pt.x} cy={pt.y} r="14" fill="none" stroke="#0ea5a9" strokeWidth="2" strokeDasharray="4 3" />}
            <circle cx={pt.x} cy={pt.y} r="8" fill="#0d1117" stroke={isSel ? '#0ea5a9' : '#34d399'} strokeWidth="2" />
            <circle cx={pt.x} cy={pt.y} r="3" fill="#34d399" />
            <text x={pt.x + 12} y={pt.y - 8} fontSize="13" fontFamily="Georgia" fontWeight="bold" fill="#e2e8f0">{pt.label}</text>
          </g>
        );
      })}
    </g>
  );
}

function SvgRays() {
  const rays = useGeometryStore((s) => s.rays);
  const points = useGeometryStore((s) => s.points);
  const selectedIds = useGeometryStore((s) => s.selectedIds);
  const playbackActive = useGeometryStore((s) => s.playbackActive);
  const playbackStep = useGeometryStore((s) => s.playbackStep);
  const dimStep = playbackActive ? playbackStep : -1;
  const isDimmed = playbackActive && dimStep >= 0;
  return (
    <g id="raysGroup">
      {rays.map((ray) => {
        const pf = points.find((p) => p.id === ray.from);
        const pt = points.find((p) => p.id === ray.to);
        if (!pf || !pt) return null;
        const isSel = selectedIds.has(ray.id);
        const opacity = isDimmed && ray.stepIndex !== undefined && ray.stepIndex > dimStep ? 0 : 1;
        return (
          <g key={ray.id} opacity={opacity}>
            {isSel && <line x1={pf.x} y1={pf.y} x2={pt.x} y2={pt.y} stroke="#0ea5a9" strokeWidth="6" strokeLinecap="round" opacity="0.3" />}
            <line x1={pf.x} y1={pf.y} x2={pt.x} y2={pt.y} stroke={isSel ? '#0ea5a9' : '#f59e0b'} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

function SvgLines() {
  const lines = useGeometryStore((s) => s.lines);
  const points = useGeometryStore((s) => s.points);
  const selectedIds = useGeometryStore((s) => s.selectedIds);
  const playbackActive = useGeometryStore((s) => s.playbackActive);
  const playbackStep = useGeometryStore((s) => s.playbackStep);
  const dimStep = playbackActive ? playbackStep : -1;
  const isDimmed = playbackActive && dimStep >= 0;
  return (
    <g id="linesGroup">
      {lines.map((line) => {
        const pa = points.find((p) => p.id === line.a);
        const pb = points.find((p) => p.id === line.b);
        if (!pa || !pb) return null;
        const isSel = selectedIds.has(line.id);
        const opacity = isDimmed && line.stepIndex !== undefined && line.stepIndex > dimStep ? 0 : 1;
        return (
          <g key={line.id} opacity={opacity}>
            {isSel && <line x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke="#0ea5a9" strokeWidth="6" strokeLinecap="round" opacity="0.3" />}
            <line x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={isSel ? '#0ea5a9' : '#60a5fa'} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

function SvgArcs() {
  const arcs = useGeometryStore((s) => s.arcs);
  const selectedIds = useGeometryStore((s) => s.selectedIds);
  const playbackActive = useGeometryStore((s) => s.playbackActive);
  const playbackStep = useGeometryStore((s) => s.playbackStep);
  const dimStep = playbackActive ? playbackStep : -1;
  const isDimmed = playbackActive && dimStep >= 0;
  return (
    <g id="arcsGroup">
      {arcs.map((arc) => {
        const isSel = selectedIds.has(arc.id);
        const opacity = isDimmed && arc.stepIndex !== undefined && arc.stepIndex > dimStep ? 0 : 1;
        if (arc.type === 'circle') {
          return (
            <g key={arc.id} opacity={opacity}>
              {isSel && <circle cx={arc.center.x} cy={arc.center.y} r={arc.radius} fill="none" stroke="#0ea5a9" strokeWidth="6" opacity="0.3" />}
              <circle cx={arc.center.x} cy={arc.center.y} r={arc.radius} fill="none" stroke={isSel ? '#0ea5a9' : '#f472b6'} strokeWidth={isSel ? '3' : '2'} strokeDasharray="8 4" />
            </g>
          );
        }
        const pathD = generateArcPath(arc);
        return (
          <g key={arc.id} opacity={opacity}>
            <path d={pathD} fill="none" stroke={isSel ? '#0ea5a9' : '#f472b6'} strokeWidth={isSel ? '3' : '2'} strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

function SvgTexts() {
  const texts = useGeometryStore((s) => s.texts);
  const selectedIds = useGeometryStore((s) => s.selectedIds);
  const playbackActive = useGeometryStore((s) => s.playbackActive);
  const playbackStep = useGeometryStore((s) => s.playbackStep);
  const dimStep = playbackActive ? playbackStep : -1;
  const isDimmed = playbackActive && dimStep >= 0;
  return (
    <g id="textsGroup">
      {texts.map((txt) => {
        const isSel = selectedIds.has(txt.id);
        const opacity = isDimmed && txt.stepIndex !== undefined && txt.stepIndex > dimStep ? 0 : 1;
        return (
          <g key={txt.id} opacity={opacity}>
            {isSel && <rect x={txt.x - 6} y={txt.y - txt.fontSize - 4} width={txt.content.length * txt.fontSize * 0.6 + 12} height={txt.fontSize + 10} fill="none" stroke="#0ea5a9" strokeWidth="1.5" strokeDasharray="4 3" rx="4" />}
            <text x={txt.x} y={txt.y} fontSize={txt.fontSize || 14} fontFamily="system-ui, sans-serif" fill={isSel ? '#0ea5a9' : '#e2e8f0'} fontWeight="500">{txt.content}</text>
          </g>
        );
      })}
    </g>
  );
}

function SvgLabels() {
  const lines = useGeometryStore((s) => s.lines);
  const rays = useGeometryStore((s) => s.rays);
  const arcs = useGeometryStore((s) => s.arcs);
  const points = useGeometryStore((s) => s.points);
  const labelPositions = useGeometryStore((s) => s.labelPositions);
  const playbackActive = useGeometryStore((s) => s.playbackActive);
  const playbackStep = useGeometryStore((s) => s.playbackStep);
  const dimStep = playbackActive ? playbackStep : -1;
  const isDimmed = playbackActive && dimStep >= 0;

  const makeLabel = (info: { x: number; y: number; text: string; id: string }, key: string, opacity: number) => (
    <g
      key={key}
      className="measure-label"
      data-id={info.id}
      opacity={opacity}
      transform={`translate(${info.x}, ${info.y})`}
      style={{ cursor: 'grab' }}
    >
      <rect x="-20" y="-10" width="40" height="20" fill="#1a2744" stroke="#1e3a5f" strokeWidth="1" rx="4" />
      <text x="0" y="0" fontSize="10" fontFamily="system-ui" fontWeight="600" fill="#94a3b8" textAnchor="middle" dominantBaseline="middle">{info.text}</text>
    </g>
  );

  return (
    <g id="labelsGroup">
      {lines.map((line) => {
        const pa = points.find((p) => p.id === line.a);
        const pb = points.find((p) => p.id === line.b);
        if (!pa || !pb) return null;
        const info = renderLineLabel(line, pa, pb, labelPositions);
        const opacity = isDimmed && line.stepIndex !== undefined && line.stepIndex > dimStep ? 0 : 1;
        return makeLabel({ ...info, id: line.id }, 'll-' + line.id, opacity);
      })}
      {rays.map((ray) => {
        const pf = points.find((p) => p.id === ray.from);
        const pt = points.find((p) => p.id === ray.to);
        if (!pf || !pt) return null;
        const info = renderRayLabel(ray, pf, pt, labelPositions);
        const opacity = isDimmed && ray.stepIndex !== undefined && ray.stepIndex > dimStep ? 0 : 1;
        return makeLabel({ ...info, id: ray.id }, 'rl-' + ray.id, opacity);
      })}
      {arcs.map((arc) => {
        const info = renderArcLabel(arc, labelPositions);
        const opacity = isDimmed && arc.stepIndex !== undefined && arc.stepIndex > dimStep ? 0 : 1;
        return makeLabel({ ...info, id: arc.id }, 'al-' + arc.id, opacity);
      })}
    </g>
  );
}

function SvgIntersections() {
  const intersections = useGeometryStore((s) => s.intersections);
  const playbackActive = useGeometryStore((s) => s.playbackActive);
  const playbackStep = useGeometryStore((s) => s.playbackStep);
  const dimStep = playbackActive ? playbackStep : -1;
  const isDimmed = playbackActive && dimStep >= 0;
  return (
    <g id="intersectionsGroup">
      {intersections.map((inter, idx) => {
        const opacity = isDimmed && inter.stepIndex !== undefined && inter.stepIndex > dimStep ? 0 : 1;
        return (
          <g key={'i' + idx} opacity={opacity}>
            <circle cx={inter.x} cy={inter.y} r="10" fill="#3b3510" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 2" />
            <circle cx={inter.x} cy={inter.y} r="3" fill="#fbbf24" />
            <text x={inter.x + 14} y={inter.y - 10} fontSize="13" fontFamily="Georgia" fontWeight="bold" fill="#fbbf24">I{idx + 1}</text>
          </g>
        );
      })}
    </g>
  );
}
