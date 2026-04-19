// paintToolPresets.ts

import spray1 from '../img/Paint/airbrush1.png'
import spray2 from '../img/Paint/airbrush2.png'
import spray3 from '../img/Paint/airbrush3.png'

import line1 from '../img/Paint/line1.png'
import line2 from '../img/Paint/line2.png'
import line3 from '../img/Paint/line3.png'
import line4 from '../img/Paint/line4.png'
import line5 from '../img/Paint/line5.png'

import zoom1 from '../img/Paint/zoom1.png'
import zoom2 from '../img/Paint/zoom2.png'
import zoom6 from '../img/Paint/zoom6.png'
import zoom8 from '../img/Paint/zoom8.png'


export const ZOOM_PRESETS = [
  { id: 'zoom-1x', value: 1, icon: zoom1, label: '100%' },
  { id: 'zoom-2x', value: 2, icon: zoom2, label: '200%' },
  { id: 'zoom-6x', value: 6, icon: zoom6, label: '600%' },
  { id: 'zoom-8x', value: 8, icon: zoom8, label: '800%' },
] as const;


export const LINE_PRESETS = [
  { id: "line-1", width: 1, icon: line1, label: "Thin line" },
  { id: "line-2", width: 2, icon: line2, label: "Small line" },
  { id: "line-3", width: 3, icon: line3, label: "Medium line" },
  { id: "line-4", width: 5, icon: line4, label: "Thick line" },
  { id: "line-5", width: 8, icon: line5, label: "Very thick line" },
] as const;

export const ERASER_PRESETS = [
  {
    id: "eraser-1",
    size: 4,
    label: "Small eraser",
    svg: `<rect x="10" y="10" width="4" height="4" fill="black"/>`,
  },
  {
    id: "eraser-2",
    size: 8,
    label: "Medium eraser",
    svg: `<rect x="8" y="8" width="8" height="8" fill="black"/>`,
  },
  {
    id: "eraser-3",
    size: 12,
    label: "Large eraser",
    svg: `<rect x="6" y="6" width="12" height="12" fill="black"/>`,
  },
  {
    id: "eraser-4",
    size: 18,
    label: "Huge eraser",
    svg: `<rect x="3" y="3" width="18" height="18" fill="black"/>`,
  },
] as const;

export type EraserPreset = typeof ERASER_PRESETS[number];

export const BRUSH_PRESETS = [
  // ── ROUND ──
  {
    id: "brush-round-1",
    shape: "round",
    size: 4,
    svg: `<circle cx="12" cy="12" r="2" fill="black"/>`,
  },
  {
    id: "brush-round-2",
    shape: "round",
    size: 8,
    svg: `<circle cx="12" cy="12" r="4" fill="black"/>`,
  },
  {
    id: "brush-round-3",
    shape: "round",
    size: 12,
    svg: `<circle cx="12" cy="12" r="6" fill="black"/>`,
  },

  // ── SQUARE ──
  {
    id: "brush-square-1",
    shape: "square",
    size: 4,
    svg: `<rect x="10" y="10" width="4" height="4" fill="black"/>`,
  },
  {
    id: "brush-square-2",
    shape: "square",
    size: 8,
    svg: `<rect x="8" y="8" width="8" height="8" fill="black"/>`,
  },
  {
    id: "brush-square-3",
    shape: "square",
    size: 12,
    svg: `<rect x="6" y="6" width="12" height="12" fill="black"/>`,
  },

  // ── DIAGONAL RIGHT ──
  {
    id: "brush-diag-right-1",
    shape: "diag-right",
    size: 4,
    svg: `<rect x="11" y="6" width="2" height="12" fill="black" transform="rotate(45 12 12)"/>`,
  },
  {
    id: "brush-diag-right-2",
    shape: "diag-right",
    size: 8,
    svg: `<rect x="10" y="4" width="4" height="16" fill="black" transform="rotate(45 12 12)"/>`,
  },
  {
    id: "brush-diag-right-3",
    shape: "diag-right",
    size: 12,
    svg: `<rect x="9" y="2" width="6" height="20" fill="black" transform="rotate(45 12 12)"/>`,
  },

  // ── DIAGONAL LEFT ──
  {
    id: "brush-diag-left-1",
    shape: "diag-left",
    size: 4,
    svg: `<rect x="11" y="6" width="2" height="12" fill="black" transform="rotate(-45 12 12)"/>`,
  },
  {
    id: "brush-diag-left-2",
    shape: "diag-left",
    size: 8,
    svg: `<rect x="10" y="4" width="4" height="16" fill="black" transform="rotate(-45 12 12)"/>`,
  },
  {
    id: "brush-diag-left-3",
    shape: "diag-left",
    size: 12,
    svg: `<rect x="9" y="2" width="6" height="20" fill="black" transform="rotate(-45 12 12)"/>`,
  },
] as const;


export const SPRAY_PRESETS = [
  {
    id: "spray-small",
    icon: spray1,
    radius: 8,
    density: 20,
    label: "Small airbrush",
  },
  {
    id: "spray-medium",
    icon: spray2,
    radius: 16,
    density: 35,
    label: "Medium airbrush",
  },
  {
    id: "spray-large",
    icon: spray3,
    radius: 24,
    density: 50,
    label: "Large airbrush",
  },
] as const;


export type LinePreset = typeof LINE_PRESETS[number];
export type BrushPreset = typeof BRUSH_PRESETS[number];
export type SprayPreset = typeof SPRAY_PRESETS[number];
export type ZoomPreset = typeof ZOOM_PRESETS[number];