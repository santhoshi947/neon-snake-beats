import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Horizon",
    artist: "SynthWave AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "var(--color-neon-cyan)"
  },
  {
    id: 2,
    title: "Cyber City",
    artist: "Digital Dreams",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "var(--color-neon-magenta)"
  },
  {
    id: 3,
    title: "Midnight Drive",
    artist: "Retro Future",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "var(--color-neon-green)"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleTrackEnd = () => {
    skipForward();
  };

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex items-center gap-6 mb-8">
        <motion.div 
          key={currentTrack.id}
          initial={{ rotate: -20, opacity: 0, scale: 0.8 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          className="w-24 h-24 rounded-xl flex items-center justify-center relative overflow-hidden group"
          style={{ backgroundColor: `${currentTrack.color}20` }}
        >
          <Music className="w-10 h-10" style={{ color: currentTrack.color }} />
          {isPlaying && (
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 border-2 rounded-xl"
              style={{ borderColor: currentTrack.color }}
            />
          )}
        </motion.div>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              <h3 className="text-xl font-bold truncate neon-text-cyan">{currentTrack.title}</h3>
              <p className="text-white/60 text-sm truncate">{currentTrack.artist}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full"
            style={{ 
              width: `${progress}%`,
              backgroundColor: currentTrack.color,
              boxShadow: `0 0 10px ${currentTrack.color}`
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <button onClick={skipBackward} className="p-2 text-white/70 hover:text-white transition-colors">
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-white text-black hover:scale-110 transition-transform"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>

          <button onClick={skipForward} className="p-2 text-white/70 hover:text-white transition-colors">
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-white/30">
          <Volume2 className="w-4 h-4" />
          <div className="w-24 h-1 bg-white/10 rounded-full">
            <div className="w-2/3 h-full bg-white/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
