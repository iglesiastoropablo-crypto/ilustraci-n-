import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {BoltSpec, flicker, Lightning, liveSeed} from '../components/Lightning';
import {Seal, SEAL_FULL} from '../components/Seal';
import {DISPLAY, easeIn, easeOut, H, mix, pulse, RED, ramp, SUB, W, WHITE} from '../theme';

/** Escena 5: el evento final, JUSTICE LEAGUE: OMAC PROJECT (180 fotogramas) */
export const OmacScene: React.FC = () => {
  const f = useCurrentFrame();
  const pre = ramp(f, 14, 40, easeOut);
  const main = ramp(f, 26, 58, easeOut);
  const out = 1 - ramp(f, 160, 180, easeIn);
  const camera = mix(1, 1.07, ramp(f, 0, 180, (t) => t));
  const spacing = mix(0.2, 0.06, ramp(f, 26, 180, easeOut));
  const sealVis = ramp(f, 4, 30, easeOut) * out;
  // pulsos de energía
  const energy = Math.max(pulse(f, 30, 4), 0.7 * pulse(f, 92, 5), 0.8 * pulse(f, 136, 5));
  const redGlow = (0.55 + 0.25 * Math.sin(f / 9) + 0.6 * energy) * out;

  const cx = W / 2;
  const cy = 640;
  const bolts: BoltSpec[] = [];
  // rayos desde los bordes hacia el título
  for (let k = 0; k < 8; k++) {
    const ang = (k / 8) * Math.PI * 2 + 0.3;
    const r0 = 1100;
    const r1 = 420 + random(`om-r${k}`) * 120;
    const density = mix(0.12, 0.38, ramp(f, 20, 150)) + energy * 0.6;
    bolts.push({
      from: [cx + Math.cos(ang) * r0, cy + Math.sin(ang) * r0 * 0.6],
      to: [cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1 * 0.38],
      seed: liveSeed(f, `om${k}`),
      opacity: flicker(f, `om${k}`, f < 20 ? 0 : density, 2) * out,
      width: 1.5,
      branches: 3,
      rough: 0.2,
    });
  }
  // gran impacto al aparecer el título
  bolts.push({
    from: [cx - 80, -40],
    to: [cx + 20, cy - 60],
    seed: liveSeed(f, 'omhit', 2),
    progress: ramp(f, 22, 28, easeIn),
    opacity: f < 22 ? 0 : 1 - ramp(f, 32, 48),
    width: 2.6,
    branches: 5,
  });
  // arcos que recorren el título
  for (let k = 0; k < 2; k++) {
    const yy = k === 0 ? cy - 150 : cy + 175;
    bolts.push({
      from: [cx - 700, yy],
      to: [cx + 700, yy + (k ? -8 : 8)],
      seed: liveSeed(f, `omline${k}`),
      opacity: f > 40 ? flicker(f, `omline${k}`, 0.18 + energy * 0.8, 2) * 0.8 * out : 0,
      width: 1,
      branches: 4,
      rough: 0.05,
    });
  }

  const flash = 0.85 * pulse(f, 27, 3.5) + 0.35 * pulse(f, 92, 3) + 0.4 * pulse(f, 136, 3);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 55% at 50% 58%, rgba(200,16,46,${0.42 * redGlow}) 0%, rgba(120,8,28,${0.16 * redGlow}) 45%, rgba(0,0,0,0) 78%)`,
        }}
      />
      <AbsoluteFill style={{transform: `scale(${camera})`}}>
        <Lightning id="omac" bolts={bolts} color="#FF2A47" glow={1.3} />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 130,
            transform: `translateX(-50%) scale(0.34)`,
            transformOrigin: 'top center',
            opacity: sealVis,
          }}
        >
          <Seal s={SEAL_FULL} />
        </div>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 200,
            opacity: out,
          }}
        >
          <div
            style={{
              fontFamily: SUB,
              fontWeight: 600,
              fontSize: 64,
              lineHeight: 1,
              color: WHITE,
              letterSpacing: `${mix(0.6, 0.42, pre)}em`,
              paddingLeft: `${mix(0.6, 0.42, pre)}em`,
              opacity: pre,
              filter: `blur(${(1 - pre) * 10}px)`,
              marginBottom: 10,
              whiteSpace: 'nowrap',
            }}
          >
            JUSTICE LEAGUE
          </div>
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 250,
              lineHeight: 0.95,
              color: WHITE,
              opacity: main,
              transform: `scale(${mix(1.14, 1, main)})`,
              filter: `blur(${(1 - main) * 22}px)`,
              letterSpacing: `${spacing}em`,
              paddingLeft: `${spacing}em`,
              textShadow: `0 0 ${30 + energy * 40}px rgba(200,16,46,${0.85}), 0 0 ${90 + energy * 60}px rgba(200,16,46,0.6)`,
              whiteSpace: 'nowrap',
            }}
          >
            OMAC PROJECT
          </div>
          <div
            style={{
              marginTop: 20,
              height: 3,
              width: 900 * ramp(f, 40, 80, easeOut),
              background: `linear-gradient(90deg, rgba(200,16,46,0), ${RED} 25%, #FF4D63 50%, ${RED} 75%, rgba(200,16,46,0))`,
              boxShadow: `0 0 20px ${RED}, 0 0 50px rgba(200,16,46,0.7)`,
            }}
          />
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 75% 65% at 50% 50%, rgba(255,120,140,${flash}) 0%, rgba(200,16,46,${flash * 0.5}) 45%, rgba(0,0,0,0) 85%)`,
          mixBlendMode: 'screen',
        }}
      />
      <AbsoluteFill style={{backgroundColor: '#000', opacity: (1 - out) * 0.6, height: H}} />
    </AbsoluteFill>
  );
};
