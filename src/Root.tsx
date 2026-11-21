import React from 'react';
import {Composition} from 'remotion';
import {ZingDCIntro} from './ZingDCIntro';
import {FPS, TOTAL_FRAMES} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="ZingDCIntro"
    component={ZingDCIntro}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
