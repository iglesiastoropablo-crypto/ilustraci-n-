import {continueRender, delayRender, staticFile} from 'remotion';

const faces: [string, string, string][] = [
  ['Bebas Neue', 'fonts/bebas-neue-latin-400-normal.woff2', '400'],
  ['Oswald', 'fonts/oswald-latin-300-normal.woff2', '300'],
  ['Oswald', 'fonts/oswald-latin-400-normal.woff2', '400'],
  ['Oswald', 'fonts/oswald-latin-500-normal.woff2', '500'],
  ['Oswald', 'fonts/oswald-latin-600-normal.woff2', '600'],
  ['Oswald', 'fonts/oswald-latin-700-normal.woff2', '700'],
];

if (typeof document !== 'undefined') {
  const handle = delayRender('Cargando tipografías');
  Promise.all(
    faces.map(([family, file, weight]) => {
      const face = new FontFace(family, `url(${staticFile(file)}) format('woff2')`, {weight});
      return face.load().then((loaded) => document.fonts.add(loaded));
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}
