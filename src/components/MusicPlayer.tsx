import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Cyberpunk City",
    artist: "AI Synthwave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12"
  },
  {
    id: 2,
    title: "Digital Horizon",
    artist: "Neon Dreams",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05"
  },
  {
    id: 3,
    title: "Neon Drive",
    artist: "Retro AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:44"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [isMuted, volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="bg-black border-4 border-[#FF00FF] p-6 shadow-[-8px_8px_0px_#00FFFF] w-full relative">
      <div className="absolute top-0 right-0 bg-[#FF00FF] text-black px-2 py-1 text-sm font-bold">AUDIO_NODE_v1.0</div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
      />

      <div className="flex items-center gap-4 mb-6 mt-4 border-b-2 border-[#00FFFF] pb-4">
        <div className="w-16 h-16 bg-black border-2 border-[#00FFFF] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[#00FFFF] opacity-20 animate-pulse"></div>
          <Music size={32} className="text-[#FF00FF]" />
        </div>
        <div className="overflow-hidden flex-1">
          <h3 className="text-2xl font-bold text-[#00FFFF] truncate uppercase glitch" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-[#FF00FF] text-lg uppercase tracking-widest truncate">
            SRC: {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-[#00FFFF] text-sm mb-1">
          <span>BUFFERING...</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div 
          className="h-6 w-full bg-black border-2 border-[#FF00FF] cursor-pointer relative"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-[#00FFFF] relative transition-all duration-75"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABZJREFUeNpi2rVrl+M/E5gAE2AAgwAECgQhA2jKjAAAAABJRU5ErkJggg==')] opacity-50"></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between border-t-2 border-b-2 border-[#00FFFF] py-4 mb-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black border border-transparent hover:border-black"
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 h-2 bg-black border border-[#00FFFF] appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #00FFFF ${volume * 100}%, black ${volume * 100}%)`
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={playPrev}
            className="p-2 text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black border border-[#00FFFF]"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 flex items-center justify-center bg-black border-2 border-[#FF00FF] text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
          
          <button 
            onClick={playNext}
            className="p-2 text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black border border-[#00FFFF]"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Playlist */}
      <div>
        <h4 className="text-lg text-[#FF00FF] uppercase tracking-widest mb-2 border-b border-[#FF00FF] inline-block">TRACK_SEQ</h4>
        <div className="space-y-1">
          {TRACKS.map((track, index) => (
            <div 
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
              }}
              className={`flex items-center justify-between p-2 cursor-pointer border ${
                index === currentTrackIndex 
                  ? 'bg-[#00FFFF] text-black border-black' 
                  : 'bg-black text-[#00FFFF] border-[#00FFFF] hover:bg-[#FF00FF] hover:text-black hover:border-black'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <span className="text-lg">
                  [{index + 1}]
                </span>
                <span className="text-lg truncate uppercase">
                  {track.title}
                </span>
              </div>
              <span className="text-lg">{track.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
