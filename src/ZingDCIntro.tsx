import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import './fonts';
import {Background, FilmGrain} from './components/Background';
import {RedTransition} from './components/RedTransition';
import {CloseScene} from './scenes/CloseScene';
import {LogoScene} from './scenes/LogoScene';
import {OmacScene} from './scenes/OmacScene';
import {SagaScene} from './scenes/SagaScene';
import {TitlesScene} from './scenes/TitlesScene';
import {easeIn, ramp, T, TITLE_LEN, TITLES} from './theme';

export const ZingDCIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const bgIn = ramp(frame, 0, 30);
  const bgOut = 1 - ramp(frame, T.end - 26, T.end, easeIn);
  const boundaries = TITLES.map((_, i) => T.titles + i * TITLE_LEN);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AbsoluteFill style={{opacity: bgIn * bgOut}}>
        <Background />
      </AbsoluteFill>
      <Sequence from={T.logo} durationInFrames={T.saga - T.logo}>
        <LogoScene />
      </Sequence>
      <Sequence from={T.saga} durationInFrames={T.titles - T.saga}>
        <SagaScene />
      </Sequence>
      <Sequence from={T.titles} durationInFrames={T.omac - T.titles}>
        <TitlesScene />
      </Sequence>
      <Sequence from={T.omac} durationInFrames={T.close - T.omac}>
        <OmacScene />
      </Sequence>
      <Sequence from={T.close} durationInFrames={T.end - T.close}>
        <CloseScene />
      </Sequence>
      {/* Transiciones de luz roja entre títulos */}
      {boundaries.slice(1).map((b) => (
        <RedTransition key={b} at={b} />
      ))}
      <RedTransition at={T.omac} span={18} strength={1.4} />
      <FilmGrain />
    </AbsoluteFill>
  );
};
