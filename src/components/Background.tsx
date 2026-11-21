import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {H, NAVY, NAVY_DEEP, W} from '../theme';

const PARTICLES = new Array(70).fill(0).map((_, i) => ({
  x: random(`px${i}`) * W,
  y: random(`py${i}`) * H,
  s: 1 + random(`ps${i}`) * 2.2,
  v: 0.15 + random(`pv${i}`) * 0.45,
  o: 0.08 + random(`po${i}`) * 0.28,
  ph: random(`pp${i}`) * Math.PI * 2,
}));

export const Background: React.FC<{redGlow?: number}> = ({redGlow = 0}) => {
  const frame = useCurrentFrame();
  const driftX = Math.sin(frame / 140) * 120;
  const driftY = Math.cos(frame / 170) * 60;
  return (
    <AbsoluteFill style={{backgroundColor: NAVY}}>
      {/* Luz central suave */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 55% 50% at ${50 + driftX / 40}% ${48 + driftY / 30}%, rgba(40,66,140,0.42) 0%, rgba(10,20,48,0) 70%)`,
        }}
      />
      {/* Niebla en movimiento */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 40% 30% at ${30 + driftX / 20}% 70%, rgba(70,100,180,0.10) 0%, rgba(0,0,0,0) 70%),
                       radial-gradient(ellipse 35% 28% at ${72 - driftX / 25}% 30%, rgba(70,100,180,0.08) 0%, rgba(0,0,0,0) 70%)`,
        }}
      />
      {redGlow > 0 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 60% 55% at 50% 52%, rgba(200,16,46,${0.38 * redGlow}) 0%, rgba(120,8,28,${0.12 * redGlow}) 45%, rgba(0,0,0,0) 75%)`,
          }}
        />
      )}
      {/* Partículas de polvo */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {PARTICLES.map((p, i) => {
          const y = (((p.y - frame * p.v) % H) + H) % H;
          const x = p.x + Math.sin(frame / 60 + p.ph) * 14;
          const tw = 0.6 + 0.4 * Math.sin(frame / 25 + p.ph);
          return <circle key={i} cx={x} cy={y} r={p.s} fill="#BFD3FF" opacity={p.o * tw} />;
        })}
      </svg>
      {/* Viñeta */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, ${NAVY_DEEP}D9 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Grano de película y viñeta final, encima de todo */
export const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.16}}>
      <svg width={W} height={H}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 24} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
