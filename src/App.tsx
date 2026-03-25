import React, { useState } from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Trophy, Music as MusicIcon, Gamepad2 } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-cyan/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-magenta/10 rounded-full blur-[100px]" />
      </div>

      <header className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between mb-8 z-10 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-neon-cyan/20 rounded-xl border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,243,255,0.3)]">
            <Gamepad2 className="w-8 h-8 text-neon-cyan" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter neon-text-cyan">NEON SNAKE</h1>
            <p className="text-white/40 text-xs font-mono uppercase tracking-widest">Retro-Future Arcade</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="absolute -inset-2 border-2 border-dashed border-neon-cyan/40 rounded-lg animate-pulse" />
            <div className="flex flex-col items-center px-4 py-2 bg-black/40 backdrop-blur-sm rounded-lg border border-white/5">
              <span className="text-neon-cyan/60 text-[8px] uppercase tracking-[0.3em] font-mono mb-1">Current Score</span>
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-neon-yellow drop-shadow-[0_0_8px_rgba(255,240,31,0.5)]" />
                <span className="text-5xl font-digital text-neon-yellow neon-text-yellow animate-glitch glitch-active tracking-tighter">
                  {score}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10">
        {/* Left Sidebar - Stats/Info */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-6">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md"
          >
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Leaderboard
            </h2>
            <div className="space-y-3">
              {[
                { name: 'CYBER_PUNK', score: 1240 },
                { name: 'NEON_GHOST', score: 980 },
                { name: 'BIT_RUNNER', score: 850 },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-white/70 font-mono">{item.name}</span>
                  <span className="text-neon-cyan font-bold">{item.score}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md"
          >
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Controls</h2>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="p-2 bg-black/40 rounded border border-white/5 text-center">UP</div>
              <div className="p-2 bg-black/40 rounded border border-white/5 text-center">DOWN</div>
              <div className="p-2 bg-black/40 rounded border border-white/5 text-center">LEFT</div>
              <div className="p-2 bg-black/40 rounded border border-white/5 text-center">RIGHT</div>
            </div>
          </motion.div>
        </div>

        {/* Center - Game Window */}
        <div className="lg:col-span-6 flex justify-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative p-2 bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="bg-black rounded-2xl p-4 border border-white/10">
              <SnakeGame onScoreChange={setScore} />
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar - Music Player */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-2 mb-4 px-2">
              <MusicIcon className="w-4 h-4 text-neon-magenta" />
              <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">Now Playing</h2>
            </div>
            <MusicPlayer />
          </motion.div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-neon-magenta/10 border border-neon-magenta/30 rounded-2xl backdrop-blur-md"
          >
            <p className="text-xs text-neon-magenta font-bold uppercase tracking-tighter mb-1">Pro Tip</p>
            <p className="text-white/70 text-sm leading-relaxed">
              Music helps focus. Try to sync your turns with the beat for a true cybernetic experience.
            </p>
          </motion.div>
        </div>
      </main>

      <footer className="mt-12 text-white/20 text-[10px] font-mono uppercase tracking-[0.3em] z-10">
        &copy; 2026 NEON ARCADE SYSTEMS • ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}
