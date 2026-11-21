import {Easing, interpolate} from 'remotion';

export const NAVY = '#0A1430';
export const NAVY_LIGHT = '#12224D';
export const NAVY_DEEP = '#040917';
export const RED = '#C8102E';
export const WHITE = '#FFFFFF';

export const DISPLAY = "'Bebas Neue', 'Oswald', 'Liberation Sans Narrow', sans-serif";
export const SUB = "'Oswald', 'Bebas Neue', 'Liberation Sans Narrow', sans-serif";

export const FPS = 30;
export const W = 1920;
export const H = 1080;

// Línea de tiempo (en fotogramas)
export const T = {
  logo: 0, // 0-6 s
  dc: 180, // 6-10 s
  saga: 300, // 10-15 s
  titles: 450, // 15-47 s
  omac: 1410, // 47-53 s
  close: 1590, // 53-58 s
  end: 1740,
};
export const TITLE_LEN = 80; // 2,67 s por título
export const TOTAL_FRAMES = T.end;

export const TITLES = [
  'The Book of Kobra',
  'The Rogues',
  'Jesse Quick',
  'Justice League: Invasion',
  'Blue and Gold',
  'Static Shock',
  'Outsiders',
  'Batman: Court of Owls',
  'Flash: Paradox',
  'Black Canary',
  'Superman Legacy',
  'Wonder Woman: Hell to Pay',
];

// Curvas suaves, sin rebotes
export const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);

export const ramp = (
  f: number,
  from: number,
  to: number,
  easing: (t: number) => number = easeInOut,
) =>
  interpolate(f, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// Pulso gaussiano centrado en c
export const pulse = (f: number, c: number, sigma: number) =>
  Math.exp(-((f - c) ** 2) / (2 * sigma * sigma));
