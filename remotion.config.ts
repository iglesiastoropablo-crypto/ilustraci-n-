import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
// Usa el Chromium headless ya instalado en la máquina en lugar de descargar uno.
Config.setBrowserExecutable('/opt/pw-browsers/chromium_headless_shell');
