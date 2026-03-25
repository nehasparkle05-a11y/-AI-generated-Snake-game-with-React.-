/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00FFFF] flex flex-col items-center justify-center p-4 font-digital selection:bg-[#FF00FF] selection:text-black relative overflow-hidden screen-tear">
      <div className="bg-static"></div>
      <div className="scanline"></div>
      
      <header className="mb-8 text-center z-10 relative">
        <h1 
          className="text-5xl md:text-7xl font-black tracking-widest text-[#00FFFF] uppercase glitch"
          data-text="SYS.SNAKE_PROTOCOL"
        >
          SYS.SNAKE_PROTOCOL
        </h1>
        <p className="text-[#FF00FF] tracking-[0.3em] uppercase text-2xl mt-2 animate-pulse">
          [ STATUS: ONLINE // GLITCH_ART_MODE ]
        </p>
      </header>

      <div className="flex flex-col xl:flex-row gap-8 items-center w-full max-w-6xl justify-center z-10 relative">
        <div className="flex-1 flex justify-center w-full">
          <SnakeGame />
        </div>
        
        <div className="w-full xl:w-96 flex-shrink-0">
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
}
