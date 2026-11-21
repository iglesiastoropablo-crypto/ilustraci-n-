import React from 'react';
import {random} from 'remotion';
import {H, W} from '../theme';

export type Pt = [number, number];

// Rayo procedural por desplazamiento del punto medio
export const boltPoints = (a: Pt, b: Pt, seed: string, detail = 6, rough = 0.22): Pt[] => {
  let pts: Pt[] = [a, b];
  let disp = Math.hypot(b[0] - a[0], b[1] - a[1]) * rough;
  for (let d = 0; d < detail; d++) {
    const next: Pt[] = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i];
      const q = pts[i + 1];
      const dx = q[0] - p[0];
      const dy = q[1] - p[1];
      const l = Math.hypot(dx, dy) || 1;
      const off = (random(`${seed}-${d}-${i}`) - 0.5) * disp;
      next.push([(p[0] + q[0]) / 2 + (-dy / l) * off, (p[1] + q[1]) / 2 + (dx / l) * off], q);
    }
    pts = next;
    disp *= 0.52;
  }
  return pts;
};

const toPath = (pts: Pt[]) => 'M' + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L');

export type BoltSpec = {
  from: Pt;
  to: Pt;
  seed: string;
  /** 0-1: cuánto del recorrido está dibujado */
  progress?: number;
  opacity?: number;
  width?: number;
  branches?: number;
  rough?: number;
  detail?: number;
};

const buildPaths = (b: BoltSpec): string[] => {
  const main = boltPoints(b.from, b.to, b.seed, b.detail ?? 6, b.rough ?? 0.22);
  const paths = [toPath(main)];
  const n = b.branches ?? 2;
  const ang = Math.atan2(b.to[1] - b.from[1], b.to[0] - b.from[0]);
  const len = Math.hypot(b.to[0] - b.from[0], b.to[1] - b.from[1]);
  for (let k = 0; k < n; k++) {
    const idx = Math.floor((0.2 + random(`${b.seed}-br${k}`) * 0.6) * (main.length - 1));
    const start = main[idx];
    const side = random(`${b.seed}-bs${k}`) > 0.5 ? 1 : -1;
    const a = ang + side * (0.35 + random(`${b.seed}-ba${k}`) * 0.6);
    const bl = len * (0.12 + random(`${b.seed}-bl${k}`) * 0.25);
    const end: Pt = [start[0] + Math.cos(a) * bl, start[1] + Math.sin(a) * bl];
    paths.push(toPath(boltPoints(start, end, `${b.seed}-b${k}`, 4, 0.3)));
  }
  return paths;
};

/**
 * Capa SVG a pantalla completa con rayos finos y halo.
 */
export const Lightning: React.FC<{
  bolts: BoltSpec[];
  color?: string;
  id: string;
  glow?: number;
  style?: React.CSSProperties;
}> = ({bolts, color = '#9EC3FF', id, glow = 1, style}) => {
  const visible = bolts.filter((b) => (b.opacity ?? 1) > 0.01 && (b.progress ?? 1) > 0.001);
  if (visible.length === 0) return null;
  const built = visible.map((b) => ({b, paths: buildPaths(b)}));
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{position: 'absolute', inset: 0, overflow: 'visible', ...style}}
    >
      <defs>
        <filter id={`glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={7 * glow} />
        </filter>
        <filter id={`glow2-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={2.2 * glow} />
        </filter>
      </defs>
      {built.map(({b, paths}, i) => {
        const w = b.width ?? 2;
        const prog = b.progress ?? 1;
        const op = b.opacity ?? 1;
        const dash = {pathLength: 1, strokeDasharray: `${prog} 2`};
        return (
          <g key={i} opacity={op} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <g filter={`url(#glow-${id})`}>
              {paths.map((d, j) => (
                <path key={j} d={d} stroke={color} strokeWidth={w * (j === 0 ? 6 : 3.5)} opacity={0.55} {...dash} />
              ))}
            </g>
            <g filter={`url(#glow2-${id})`}>
              {paths.map((d, j) => (
                <path key={j} d={d} stroke={color} strokeWidth={w * (j === 0 ? 2.2 : 1.3)} {...dash} />
              ))}
            </g>
            {paths.map((d, j) => (
              <path key={j} d={d} stroke="#FFFFFF" strokeWidth={w * (j === 0 ? 0.8 : 0.45)} {...dash} />
            ))}
          </g>
        );
      })}
    </svg>
  );
};

/** Parpadeo eléctrico: devuelve 0 o una intensidad 0.4-1, cambiando cada `hold` fotogramas */
export const flicker = (frame: number, seed: string, density: number, hold = 2) => {
  const step = Math.floor(frame / hold);
  return random(`${seed}-f${step}`) < density ? 0.4 + 0.6 * random(`${seed}-i${step}`) : 0;
};

/** Semilla que cambia cada `hold` fotogramas para que el rayo "viva" */
export const liveSeed = (frame: number, seed: string, hold = 2) => `${seed}-${Math.floor(frame / hold)}`;
