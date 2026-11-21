import React from 'react';
import {DISPLAY, NAVY, RED, WHITE} from '../theme';

export type SealState = {
  box: number; // dibujo del marco 0-1
  fill: number; // relleno de la caja 0-1
  letters: number[]; // aparición de Z I N G
  bolt: number; // rayo sobre la I
  boltGlow: number; // destello extra del rayo
  line: number; // línea roja bajo la caja
  dc: number; // revelado de "DC"
  gleam: number; // barrido de luz por la caja (-1 = apagado, 0-1 posición)
  dcGleam: number;
};

export const SEAL_FULL: SealState = {
  box: 1,
  fill: 1,
  letters: [1, 1, 1, 1],
  bolt: 1,
  boltGlow: 0,
  line: 1,
  dc: 1,
  gleam: -1,
  dcGleam: -1,
};

export const BOX_W = 620;
export const BOX_H = 270;
const LINE_GAP = 38;
const DC_SIZE = 150;
/** Alto total del sello completo (caja + línea + DC) */
export const SEAL_H = BOX_H + LINE_GAP + 3 + 26 + DC_SIZE * 0.82;

const LETTERS = ['Z', 'I', 'N', 'G'];

// Rayo estilizado (icono) sobre la I
const BoltIcon: React.FC<{size: number; glow: number}> = ({size, glow}) => (
  <svg
    width={size * 0.62}
    height={size}
    viewBox="0 0 62 100"
    style={{overflow: 'visible', filter: `drop-shadow(0 0 ${6 + glow * 28}px rgba(170,205,255,${0.55 + glow * 0.45}))`}}
  >
    <path
      d="M40 0 L6 56 L28 56 L18 100 L58 38 L35 38 L48 0 Z"
      fill={WHITE}
      stroke={NAVY}
      strokeWidth={9}
      strokeLinejoin="round"
      paintOrder="stroke"
    />
  </svg>
);

const Gleam: React.FC<{pos: number; width: number; opacity?: number}> = ({pos, width, opacity = 0.55}) =>
  pos < 0 || pos > 1 ? null : (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          height: '160%',
          width: width * 0.22,
          left: -width * 0.3 + pos * width * 1.4,
          transform: 'skewX(-20deg)',
          background:
            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(190,215,255,0.9) 50%, rgba(255,255,255,0) 100%)',
          opacity,
          filter: 'blur(6px)',
        }}
      />
    </div>
  );

export const Seal: React.FC<{s: SealState}> = ({s}) => {
  const dcInset = (1 - s.dc) * 50;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: BOX_W}}>
      {/* Caja ZING */}
      <div style={{position: 'relative', width: BOX_W, height: BOX_H}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: s.fill,
            background: 'linear-gradient(180deg, #13255A 0%, #0B1638 55%, #08112B 100%)',
            boxShadow: `0 0 ${60 * s.fill}px rgba(60,100,200,0.35), inset 0 0 40px rgba(0,0,0,0.5)`,
          }}
        />
        <svg width={BOX_W} height={BOX_H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <rect
            x={2}
            y={2}
            width={BOX_W - 4}
            height={BOX_H - 4}
            fill="none"
            stroke={WHITE}
            strokeWidth={4}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - s.box}
            style={{filter: 'drop-shadow(0 0 6px rgba(180,210,255,0.8))'}}
          />
          <rect
            x={14}
            y={14}
            width={BOX_W - 28}
            height={BOX_H - 28}
            fill="none"
            stroke={WHITE}
            strokeOpacity={0.28}
            strokeWidth={1.5}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={-(1 - s.box)}
          />
        </svg>
        <Gleam pos={s.gleam} width={BOX_W} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: DISPLAY,
            fontSize: 232,
            lineHeight: 1,
            color: WHITE,
            paddingTop: 22,
            letterSpacing: '0.1em',
            paddingLeft: '0.1em',
          }}
        >
          {LETTERS.map((l, i) => {
            const p = s.letters[i] ?? 1;
            return (
              <span
                key={l}
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  opacity: p,
                  filter: `blur(${(1 - p) * 14}px)`,
                  transform: `translateY(${(1 - p) * 16}px) scale(${1 + (1 - p) * 0.08})`,
                  textShadow: '0 0 24px rgba(160,195,255,0.35)',
                }}
              >
                {l}
                {l === 'I' && s.bolt > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      marginLeft: '0.02em',
                      top: -72,
                      transform: `translateX(-50%) scale(${0.85 + 0.15 * s.bolt})`,
                      opacity: s.bolt,
                      lineHeight: 0,
                    }}
                  >
                    <BoltIcon size={104} glow={s.boltGlow} />
                  </div>
                )}
              </span>
            );
          })}
        </div>
      </div>
      {/* Línea roja */}
      <div
        style={{
          marginTop: LINE_GAP,
          height: 3,
          width: BOX_W * s.line,
          background: `linear-gradient(90deg, rgba(200,16,46,0) 0%, ${RED} 18%, #FF3B55 50%, ${RED} 82%, rgba(200,16,46,0) 100%)`,
          boxShadow: `0 0 14px ${RED}, 0 0 30px rgba(200,16,46,0.6)`,
          opacity: s.line > 0 ? 1 : 0,
        }}
      />
      {/* DC */}
      <div
        style={{
          position: 'relative',
          marginTop: 26,
          height: DC_SIZE * 0.82,
          fontFamily: DISPLAY,
          fontSize: DC_SIZE,
          lineHeight: 0.82,
          color: WHITE,
          letterSpacing: `${0.36 + (1 - s.dc) * 0.35}em`,
          paddingLeft: `${0.36 + (1 - s.dc) * 0.35}em`,
          clipPath: `inset(-20% ${dcInset}% -20% ${dcInset}%)`,
          opacity: s.dc > 0 ? Math.min(1, s.dc * 1.6) : 0,
          textShadow: '0 0 30px rgba(160,195,255,0.4)',
          paddingTop: DC_SIZE * 0.06,
        }}
      >
        DC
        <Gleam pos={s.dcGleam} width={BOX_W * 0.6} opacity={0.7} />
      </div>
    </div>
  );
};
