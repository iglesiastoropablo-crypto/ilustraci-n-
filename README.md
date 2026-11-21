# ZING DC · Intro de estudio

Motion graphic de presentación del sello **ZING DC** (plataforma de streaming ficticia ZING), hecho con [Remotion](https://www.remotion.dev/).

- Vídeo final: [`out/zing-dc-intro.mp4`](out/zing-dc-intro.mp4) · 1920×1080 · 30 fps · 58 s · sin audio
- Tipografías: Bebas Neue (títulos) y Oswald (subtítulos), incluidas en `public/fonts` desde los paquetes de Fontsource.
- Solo tipografía, formas abstractas y luz: rayos procedurales en SVG, sin logos oficiales ni imágenes de personajes.

## Estructura

| Tiempo | Escena | Archivo |
| --- | --- | --- |
| 0-6 s | Logo ZING con destello eléctrico y rayo sobre la I | `src/scenes/LogoScene.tsx` |
| 6-10 s | Revelado de "DC": sello ZING DC | `src/scenes/LogoScene.tsx` |
| 10-15 s | THE DARKNESS SAGA · CHAPTER ONE: EYES IN THE DARK | `src/scenes/SagaScene.tsx` |
| 15-47 s | 12 títulos de la fase (2,67 s cada uno) con transición de luz roja | `src/scenes/TitlesScene.tsx`, `src/components/RedTransition.tsx` |
| 47-53 s | Evento final: JUSTICE LEAGUE: OMAC PROJECT | `src/scenes/OmacScene.tsx` |
| 53-58 s | Cierre: sello ZING DC y "Solo en ZING" | `src/scenes/CloseScene.tsx` |

Colores, tiempos y la lista de títulos están en `src/theme.ts`.

## Uso

```bash
npm install
npm run studio   # previsualizar
npm run render   # genera out/zing-dc-intro.mp4
```

`remotion.config.ts` apunta al Chromium headless ya instalado (`/opt/pw-browsers/chromium_headless_shell`). Si tu máquina no lo tiene, borra la línea `setBrowserExecutable` y Remotion descargará su propio navegador.
