import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BoltSpec, Lightning, liveSeed} from './Lightning';
import {H, mix, pulse, RED, W} from '../theme';

/**
 * Transición de luz roja centrada en el fotograma `at` (dura ~2*span).
 * El destello horizontal recorre la pantalla y deja un lavado rojo.
 */
export const RedTransition: React.FC<{at: number; span?: number; y?: number; strength?: number}> = ({
  at,
  span = 14,
  y = 640,
  strength = 1,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (Math.abs(t) > span + 2) return null;
  const k = (t + span) / (2 * span); // 0..1
  const I = pulse(t, 0, span / 2.6) * strength;
  const sweepX = mix(-0.25, 1.25, k) * W;

  const bolts: BoltSpec[] = [
    {
      from: [sweepX - 520, y + 4],
      to: [sweepX + 80, y - 6],
      seed: liveSeed(frame, `rt${at}`),
      opacity: Math.min(1, I * 1.3),
      width: 1.2,
      branches: 3,
      rough: 0.07,
    },
  ];

  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
      {/* Lavado rojo */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 55% at ${(sweepX / W) * 100}% ${(y / H) * 100}%, rgba(200,16,46,${0.45 * I}) 0%, rgba(200,16,46,${0.12 * I}) 45%, rgba(0,0,0,0) 80%)`,
        }}
      />
      {/* Banda de luz que barre */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: sweepX - 160,
          width: 320,
          background: `linear-gradient(90deg, rgba(200,16,46,0), rgba(230,30,60,${0.3 * I}), rgba(200,16,46,0))`,
          filter: 'blur(30px)',
        }}
      />
      {/* Destello anamórfico */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: y - 2,
          height: 4,
          opacity: I,
          transform: `scaleX(${mix(0.3, 1.3, k)})`,
          background: `linear-gradient(90deg, rgba(200,16,46,0) 0%, ${RED} 25%, #FFD0D6 50%, ${RED} 75%, rgba(200,16,46,0) 100%)`,
          boxShadow: `0 0 18px ${RED}, 0 0 50px rgba(200,16,46,0.8)`,
        }}
      />
      <Lightning id={`rt${at}`} bolts={bolts} color="#FF3350" />
    </AbsoluteFill>
  );
};
