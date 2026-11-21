import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BoltSpec, flicker, Lightning, liveSeed} from '../components/Lightning';
import {DISPLAY, easeIn, easeOut, mix, RED, ramp, SUB, W, WHITE} from '../theme';

/** Escena 3: THE DARKNESS SAGA / CHAPTER ONE (150 fotogramas) */
export const SagaScene: React.FC = () => {
  const f = useCurrentFrame();
  const t1 = ramp(f, 6, 46, easeOut);
  const track = ramp(f, 6, 110, easeOut);
  const line = ramp(f, 40, 76, easeOut);
  const sub = ramp(f, 54, 88, easeOut);
  const out = 1 - ramp(f, 128, 150, easeIn);
  const camera = mix(1.04, 1, ramp(f, 0, 150, (t) => t));

  const bolts: BoltSpec[] = [];
  for (let k = 0; k < 4; k++) {
    const x = k < 2 ? 120 + k * 160 : W - 120 - (k - 2) * 160;
    bolts.push({
      from: [x, -20],
      to: [x + (k % 2 ? 60 : -60), 260 + k * 30],
      seed: liveSeed(f, `saga${k}`),
      opacity: flicker(f, `saga${k}`, 0.12, 3) * 0.45 * out,
      width: 1,
      branches: 2,
    });
  }

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Lightning id="saga" bolts={bolts} color="#FF4D63" glow={1.2} />
      <AbsoluteFill
        style={{
          transform: `scale(${camera})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 190,
            lineHeight: 1,
            color: WHITE,
            opacity: t1,
            filter: `blur(${(1 - t1) * 16}px)`,
            letterSpacing: `${mix(0.42, 0.12, track)}em`,
            paddingLeft: `${mix(0.42, 0.12, track)}em`,
            textShadow: '0 0 40px rgba(160,195,255,0.35)',
            whiteSpace: 'nowrap',
          }}
        >
          THE DARKNESS SAGA
        </div>
        <div
          style={{
            marginTop: 26,
            height: 2,
            width: 1100 * line,
            background: `linear-gradient(90deg, rgba(200,16,46,0), ${RED} 25%, #FF4D63 50%, ${RED} 75%, rgba(200,16,46,0))`,
            boxShadow: `0 0 16px ${RED}`,
          }}
        />
        <div
          style={{
            position: 'relative',
            marginTop: 34,
            fontFamily: SUB,
            fontWeight: 500,
            fontSize: 56,
            lineHeight: 1.2,
            color: RED,
            letterSpacing: '0.28em',
            paddingLeft: '0.28em',
            clipPath: `inset(-20% ${(1 - sub) * 100}% -20% 0)`,
            textShadow: `0 0 18px rgba(200,16,46,0.75)`,
            filter: 'brightness(1.15)',
            whiteSpace: 'nowrap',
          }}
        >
          CHAPTER ONE: EYES IN THE DARK
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
