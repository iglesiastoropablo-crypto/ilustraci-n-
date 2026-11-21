import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Seal, SEAL_FULL} from '../components/Seal';
import {DISPLAY, easeIn, easeOut, mix, RED, ramp, SUB, TITLE_LEN, TITLES, WHITE} from '../theme';

const MAX_W = 1560;

// Ancho medio aproximado de un carácter de Bebas Neue (en em)
const fitSize = (text: string, max: number, spacing: number) => {
  const est = text.length * 0.43 + text.length * spacing;
  return Math.min(max, MAX_W / est);
};

const TitleCard: React.FC<{title: string}> = ({title}) => {
  const f = useCurrentFrame();
  const [pre, main] = title.includes(':') ? title.split(':').map((s) => s.trim()) : [null, title];
  const mainText = main.toUpperCase();

  const inT = ramp(f, 4, 24, easeOut);
  const preT = ramp(f, 0, 20, easeOut);
  const outT = ramp(f, TITLE_LEN - 16, TITLE_LEN, easeIn);
  const vis = inT * (1 - outT);
  const spacing = mix(0.16, 0.06, ramp(f, 4, TITLE_LEN, (t) => t));
  const size = fitSize(mainText, 230, 0.16);
  const scale = mix(1.05, 1, inT) * mix(1, 0.97, outT);

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 170,
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${scale})`}}>
        {pre && (
          <div
            style={{
              fontFamily: SUB,
              fontWeight: 500,
              fontSize: 54,
              lineHeight: 1,
              color: WHITE,
              opacity: preT * (1 - outT) * 0.9,
              letterSpacing: `${mix(0.5, 0.36, preT)}em`,
              paddingLeft: `${mix(0.5, 0.36, preT)}em`,
              marginBottom: 18,
              filter: `blur(${(1 - preT + outT) * 8}px)`,
              whiteSpace: 'nowrap',
            }}
          >
            {pre.toUpperCase()}
          </div>
        )}
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: size,
            lineHeight: 0.95,
            color: WHITE,
            opacity: vis,
            filter: `blur(${(1 - inT + outT) * 14}px)`,
            letterSpacing: `${spacing}em`,
            paddingLeft: `${spacing}em`,
            textShadow: '0 0 36px rgba(160,195,255,0.35)',
            whiteSpace: 'nowrap',
          }}
        >
          {mainText}
        </div>
        <div
          style={{
            marginTop: 26,
            height: 2,
            width: 320 * ramp(f, 10, 40, easeOut) * (1 - outT),
            background: `linear-gradient(90deg, rgba(200,16,46,0), ${RED} 30%, #FF4D63 50%, ${RED} 70%, rgba(200,16,46,0))`,
            boxShadow: `0 0 12px ${RED}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Escena 4: los 12 títulos de la fase (960 fotogramas) */
export const TitlesScene: React.FC = () => {
  const f = useCurrentFrame();
  const total = TITLES.length * TITLE_LEN;
  const sealVis = ramp(f, 0, 24, easeOut) * (1 - ramp(f, total - 16, total, easeIn));
  return (
    <AbsoluteFill>
      {/* Sello pequeño fijo encima de cada título */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 150,
          transform: `translateX(-50%) scale(0.34)`,
          transformOrigin: 'top center',
          opacity: sealVis,
        }}
      >
        <Seal s={SEAL_FULL} />
      </div>
      {TITLES.map((t, i) => (
        <Sequence key={t} from={i * TITLE_LEN} durationInFrames={TITLE_LEN} layout="none">
          <TitleCard title={t} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
