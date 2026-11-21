import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BoltSpec, flicker, Lightning, liveSeed} from '../components/Lightning';
import {BOX_H, BOX_W, Seal, SEAL_H} from '../components/Seal';
import {easeIn, easeInOut, easeOut, H, mix, pulse, ramp, W} from '../theme';

// Posición (en pantalla) del rayo sobre la I, con el sello centrado
export const I_X = 905;
export const I_Y = 360;

/** Escenas 1 y 2: aparición del logo ZING (0-6 s) y revelado de DC (6-10 s). 300 fotogramas. */
export const LogoScene: React.FC = () => {
  const f = useCurrentFrame();

  const box = ramp(f, 30, 58, easeInOut);
  const fill = ramp(f, 30, 52, easeOut);
  const letters = [0, 1, 2, 3].map((i) => ramp(f, 36 + i * 5, 58 + i * 5, easeOut));
  const bolt = ramp(f, 62, 66, easeOut);
  const boltGlow = pulse(f, 64, 6) + 0.6 * pulse(f, 205, 10);
  const gleam = f >= 110 && f <= 150 ? ramp(f, 110, 150, easeInOut) : -1;

  // Revelado DC
  const lift = ramp(f, 180, 218, easeInOut);
  const line = ramp(f, 196, 228, easeInOut);
  const dc = ramp(f, 208, 244, easeOut);
  const dcGleam = f >= 248 && f <= 278 ? ramp(f, 248, 278, easeInOut) : -1;

  const sealY = -lift * (SEAL_H / 2 - BOX_H / 2);
  const camera = mix(1, 1.06, ramp(f, 0, 300, (t) => t));
  const fadeOut = 1 - ramp(f, 282, 300, easeIn);
  const fadeIn = ramp(f, 0, 26, easeOut);

  // Rayos
  const cx = W / 2;
  const cy = H / 2;
  const bolts: BoltSpec[] = [];
  // chispas previas
  for (let k = 0; k < 3; k++) {
    const o = flicker(f, `pre${k}`, f >= 10 && f < 30 ? 0.35 : 0, 2) * ramp(f, 10, 28);
    const a = (k / 3) * Math.PI * 2 + 0.5;
    bolts.push({
      from: [cx + Math.cos(a) * 60, cy + Math.sin(a) * 40],
      to: [cx + Math.cos(a) * 260, cy + Math.sin(a) * 150],
      seed: liveSeed(f, `pre${k}`),
      opacity: o * 0.7,
      width: 1.1,
      branches: 1,
    });
  }
  // descarga principal horizontal
  bolts.push({
    from: [-40, cy + 10],
    to: [W + 40, cy - 20],
    seed: liveSeed(f, 'main', 3),
    progress: ramp(f, 27, 34, easeOut),
    opacity: f < 27 ? 0 : 1 - ramp(f, 36, 52),
    width: 2.4,
    branches: 4,
    rough: 0.08,
    detail: 7,
  });
  // impacto sobre la I
  bolts.push({
    from: [I_X + 120, -40],
    to: [I_X, I_Y],
    seed: liveSeed(f, 'strike', 2),
    progress: ramp(f, 57, 63, easeIn),
    opacity: f < 57 ? 0 : 1 - ramp(f, 66, 80),
    width: 2,
    branches: 3,
    rough: 0.18,
  });
  // arcos alrededor del icono tras el impacto
  for (let k = 0; k < 3; k++) {
    const live = f >= 63 && f < 96;
    const a = -Math.PI / 2 + (k - 1) * 0.9;
    bolts.push({
      from: [I_X, I_Y],
      to: [I_X + Math.cos(a) * 110, I_Y + Math.sin(a) * 70],
      seed: liveSeed(f, `arc${k}`),
      opacity: live ? flicker(f, `arc${k}`, 0.6) * (1 - ramp(f, 63, 96)) : 0,
      width: 0.9,
      branches: 1,
    });
  }
  // pequeños arcos por el borde de la caja mientras se sostiene el logo
  const left = cx - BOX_W / 2;
  const top = cy - BOX_H / 2 + sealY;
  for (let k = 0; k < 2; k++) {
    const live = f > 90 && f < 270;
    const t0 = ((Math.floor(f / 18) * 0.37 + k * 0.5) % 1) * BOX_W;
    const y = k === 0 ? top : top + BOX_H;
    bolts.push({
      from: [left + t0, y],
      to: [left + Math.min(BOX_W, t0 + 90), y + (k === 0 ? -6 : 6)],
      seed: liveSeed(f, `edge${k}`),
      opacity: live ? flicker(f, `edge${k}`, 0.22, 2) * 0.75 : 0,
      width: 0.8,
      branches: 1,
      rough: 0.35,
    });
  }
  // chispas a lo largo de la línea roja
  bolts.push({
    from: [cx - (BOX_W / 2) * line, top + BOX_H + 38],
    to: [cx + (BOX_W / 2) * line, top + BOX_H + 38],
    seed: liveSeed(f, 'line'),
    opacity: f > 196 && f < 236 ? flicker(f, 'line', 0.7) * (1 - ramp(f, 222, 236)) : 0,
    width: 0.9,
    branches: 2,
    rough: 0.06,
  });

  const flash = 0.75 * pulse(f, 31, 4) + 0.45 * pulse(f, 63, 3);

  return (
    <AbsoluteFill style={{opacity: fadeOut * fadeIn}}>
      <AbsoluteFill style={{transform: `scale(${camera})`}}>
        <div
          style={{
            position: 'absolute',
            left: W / 2 - BOX_W / 2,
            top: H / 2 - BOX_H / 2,
            transform: `translateY(${sealY}px)`,
          }}
        >
          <Seal s={{box, fill, letters, bolt, boltGlow, line, dc, gleam, dcGleam}} />
        </div>
        <Lightning id="logo" bolts={bolts} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, rgba(200,225,255,${flash}) 0%, rgba(120,160,255,${flash * 0.4}) 40%, rgba(0,0,0,0) 80%)`,
          mixBlendMode: 'screen',
        }}
      />
    </AbsoluteFill>
  );
};
