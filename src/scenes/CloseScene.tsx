import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BoltSpec, flicker, Lightning, liveSeed} from '../components/Lightning';
import {BOX_W, Seal, SEAL_FULL, SEAL_H} from '../components/Seal';
import {easeIn, easeOut, H, mix, pulse, ramp, SUB, W, WHITE} from '../theme';

const SCALE = 0.86;

/** Escena 6: cierre con el sello centrado y "Solo en ZING" (150 fotogramas) */
export const CloseScene: React.FC = () => {
  const f = useCurrentFrame();
  const seal = ramp(f, 8, 46, easeOut);
  const tag = ramp(f, 52, 86, easeOut);
  const out = 1 - ramp(f, 124, 150, easeIn);
  const camera = mix(1.03, 1, ramp(f, 0, 150, easeOut));
  const sealTop = H / 2 - (SEAL_H * SCALE + 110) / 2 - 10;

  const iconX = W / 2 - 67 * SCALE;
  const iconY = sealTop - 10;
  const bolts: BoltSpec[] = [0, 1].map((k) => ({
    from: [iconX, iconY],
    to: [iconX + (k ? 120 : -100), iconY - 60],
    seed: liveSeed(f, `cl${k}`),
    opacity: f > 40 && f < 80 ? flicker(f, `cl${k}`, 0.45) * (1 - ramp(f, 40, 80)) : 0,
    width: 0.9,
    branches: 1,
  }));

  return (
    <AbsoluteFill style={{opacity: out, transform: `scale(${camera})`}}>
      <div
        style={{
          position: 'absolute',
          left: W / 2 - (BOX_W * SCALE) / 2,
          top: sealTop,
          width: BOX_W,
          transform: `scale(${SCALE})`,
          transformOrigin: 'top left',
          opacity: seal,
          filter: `blur(${(1 - seal) * 14}px)`,
        }}
      >
        <Seal s={{...SEAL_FULL, boltGlow: pulse(f, 46, 6), gleam: f > 60 && f < 96 ? ramp(f, 60, 96) : -1}} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: sealTop + SEAL_H * SCALE + 64,
          textAlign: 'center',
          fontFamily: SUB,
          fontWeight: 400,
          fontSize: 54,
          lineHeight: 1,
          color: WHITE,
          letterSpacing: `${mix(0.5, 0.3, tag)}em`,
          paddingLeft: `${mix(0.5, 0.3, tag)}em`,
          opacity: tag * 0.95,
          filter: `blur(${(1 - tag) * 8}px)`,
        }}
      >
        Solo en ZING
      </div>
      <Lightning id="close" bolts={bolts} />
    </AbsoluteFill>
  );
};
