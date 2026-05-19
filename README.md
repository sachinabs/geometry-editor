# React Geometry Editor — Interactive Drawing Component

An **interactive geometry editor** built as a **React component** for drawing, measuring, and analyzing geometric constructions. Includes a **ruler**, **protractor**, **compass**, arc and circle tools, intersection detection, step-by-step construction playback, and SVG/PNG/JSON export. Ideal for **math education**, **online tutoring**, **geometry worksheets**, and **STEM teaching apps**.

[![npm version](https://img.shields.io/npm/v/geometry-editor)](https://www.npmjs.com/package/geometry-editor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)](https://www.typescriptlang.org/)

---

## What is Geometry Editor?

Geometry Editor is a **React geometry drawing tool** that lets users construct geometric figures interactively using virtual **straightedge and compass** tools. It records every construction step and supports **step-by-step playback**, making it a powerful **teaching tool for geometry classes**. The entire editor is a single **React component** you can drop into any app.

---

## Features

- **Ruler (straightedge)** — draw measurable line segments with automatic cm distance labels
- **Protractor** — draw rays at precise angles (snaps to 15° increments) and measure existing angles
- **Compass** — draw arcs and full circles by setting radius and angle range
- **Point tool** — place labeled points on the canvas
- **Text tool** — add annotations and labels anywhere
- **Intersection detection** — find crossing points between lines, rays, and arcs automatically
- **Undo / Redo** — full construction history with snapshot-based undo
- **Step playback** — replay every construction step in sequence (great for classroom demonstrations)
- **SVG export** — download the canvas as an SVG file
- **PNG export** — render the canvas to PNG image
- **JSON save/load** — save constructions to JSON and reload them later
- **Custom keyboard shortcuts** — remap every tool to your preferred keys
- **Hideable panels** — independently toggle the header, tool panel, right panel, and instruction bar
- **Programmatic export** — access SVG string, JSON string, and PNG data URL via a React ref

---

## Installation

```bash
npm install geometry-editor
```

**Peer dependencies:**

```bash
npm install react react-dom
```

---

## Quick Start

```tsx
import { GeometryEditor } from 'geometry-editor';

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <GeometryEditor />
    </div>
  );
}
```

Paste this into any React project and you get a fully functional **geometric construction editor** with all tools, undo/redo, and export support.

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | — | CSS class for the root container |
| `style` | `CSSProperties` | — | Inline styles (merged into root) |
| `showHeader` | `boolean` | `true` | Show the top bar with Undo, Redo, Example, Clear |
| `showToolPanel` | `boolean` | `true` | Show the left tool selection sidebar |
| `showRightPanel` | `boolean` | `true` | Show the right panel (actions, steps, shortcuts) |
| `showInstructionBar` | `boolean` | `true` | Show the bottom instruction overlay inside the drawing canvas |
| `keyBindings` | `KeyBindings` | — | Custom keyboard shortcuts (merged over defaults) |
| `onExportSVG` | `(svg: string) => void` | — | Callback before SVG download, receives SVG markup |
| `onExportJSON` | `(data: string) => void` | — | Callback before JSON download |
| `onExportPNG` | `(dataUrl: string) => void` | — | Callback before PNG download, receives data URL |
| `onStepsChange` | `(steps: StepData[]) => void` | — | Fires whenever construction steps change |
| `onDataChange` | `(data: EditorData) => void` | — | Fires whenever any geometry data changes |

---

## Programmatic Export via Ref

Access export methods imperatively using a React ref:

```tsx
import { useRef } from 'react';
import { GeometryEditor } from 'geometry-editor';
import type { ExportHandle } from 'geometry-editor';

function App() {
  const ref = useRef<ExportHandle>(null);

  const downloadSVG = () => {
    const svg = ref.current?.toSVG();
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'geometry.svg';
    a.click();
  };

  const downloadJSON = () => {
    const data = ref.current?.toJSON();
    if (!data) return;
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'geometry.json';
    a.click();
  };

  const downloadPNG = async () => {
    const png = await ref.current?.toPNG();
    if (!png) return;
    const a = document.createElement('a');
    a.href = png;
    a.download = 'geometry.png';
    a.click();
  };

  return (
    <div style={{ height: '100vh' }}>
      <GeometryEditor ref={ref} />
      <button onClick={downloadSVG}>Export SVG</button>
      <button onClick={downloadJSON}>Save JSON</button>
      <button onClick={downloadPNG}>Export PNG</button>
    </div>
  );
}
```

| Method | Returns | Description |
|--------|---------|-------------|
| `toSVG()` | `string` | SVG markup of the current canvas |
| `toJSON()` | `string` | Full geometry data as a JSON string |
| `toPNG()` | `Promise<string>` | Rendered PNG as a base64 data URL |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1` | Ruler (straightedge) |
| `2` | Protractor |
| `3` | Compass |
| `4` | Point |
| `5` | Text |
| `6` | Find intersections |
| `7` | Hand (pan canvas) |
| `8` | Move / Select |
| `9` | Eraser |
| `Delete` / `Backspace` | Delete selected elements |
| `Escape` | Clear selection |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` / `Ctrl+Y` | Redo |
| `Ctrl+A` | Select all elements |
| `Space` (hold) | Temporarily switch to Hand (release returns to previous tool) |
| `Shift` (hold) | Constrain ruler to 15° angle increments |
| `+` / `=` | Zoom in |
| `-` / `_` | Zoom out |
| `0` | Reset zoom |
| Arrow keys | Nudge selection (hold Shift for 10× step) |

---

## Custom Key Bindings

Override or extend the default shortcuts by passing a partial map. The provided keys are merged on top of the defaults.

```tsx
<GeometryEditor
  keyBindings={{
    'r': 'ruler',
    'p': 'protractor',
    'e': 'eraser',
  }}
/>
```

**Available action names:** `ruler`, `protractor`, `compass`, `point`, `text`, `intersect`, `hand`, `move`, `eraser`, `delete`, `clearSelection`, `zoomIn`, `zoomOut`, `zoomReset`.

Modifier key combos (`Ctrl+Z`, `Ctrl+A`, arrow keys) and `Space` for temporary Hand are built-in and cannot be remapped.

---

## Tools Overview

| Tool | Icon | What it does |
|------|------|-------------|
| **Ruler** | 📏 | Click two points to draw a line. The distance appears in centimeters. Hold Shift to snap to 15° angles. |
| **Protractor** | 📐 | Click a center point, then click again to draw a ray at a measured angle. |
| **Compass** | 🌀 | Click center, then click again to set radius. Drag to sweep an arc. Select center + arc, then press "Draw Full Circle" to complete a circle. |
| **Point** | ⚫ | Click anywhere to place a labeled point (A, B, C...). |
| **Text** | T | Click to place a text annotation on the canvas. |
| **Intersection** | ✕ | Auto-detect crossing points between all lines, rays, and arcs on the canvas. |
| **Hand** | ✋ | Drag to pan the canvas. |
| **Move** | ✦ | Drag points and labels to reposition them. Click to select elements. |
| **Eraser** | 🗑️ | Click an element to delete it. Connected lines/rays are removed automatically. |

---

## TypeScript Types

All types are exported for TypeScript users:

```tsx
import type {
  Tool,              // Union of all tool names
  PointData,         // { id, x, y, label, stepIndex? }
  LineData,          // { id, a, b, stepIndex? }
  RayData,           // { id, from, to, angle, stepIndex? }
  ArcData,           // { id, center, radius, startAngle, endAngle, type, stepIndex? }
  TextData,          // { id, x, y, content, fontSize, stepIndex? }
  IntersectionData,  // { id, x, y, stepIndex? }
  StepData,          // { num, text, elementIds? }
  EditorData,        // { points, lines, rays, arcs, texts, steps }
  ExportHandle,      // { toSVG, toJSON, toPNG }
  KeyBindings,       // { [key: string]: string }
} from 'geometry-editor';
```

---

## Use Cases

- **Math education**: Students construct geometric figures step-by-step — bisect angles, draw perpendiculars, build equilateral triangles
- **Online tutoring**: Teachers demonstrate geometric constructions in real time on a shared screen
- **Geometry worksheets**: Export constructions as SVG or PNG and embed them in assignments
- **EdTech platforms**: Integrate geometry drawing into homework apps, quiz builders, or interactive textbooks
- **STEM education**: Visualize geometric principles like the Pythagorean theorem, circle theorems, and angle properties
- **Whiteboard tools**: Add a geometry sandbox to any collaborative drawing application

---

## Architecture

The component is built with:

- **React 18** — component-based UI with hooks
- **Zustand** — lightweight state management for undo/redo and real-time data sync
- **SVG rendering** — all geometry is rendered to SVG for crisp, scalable output
- **TypeScript** — full type definitions included
- **Vite** — fast builds and development server

---

## License

MIT — free for personal, educational, and commercial use.
