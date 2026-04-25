import React from 'react';
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { PLAYLIST } from '../constants';

interface MusicPlayerProps {
  currentTrackIndex: number;
  isPlaying: boolean;
  volume: number;
  onPlayPause: () => void;
  onSkipNext: () => void;
  onSkipPrev: () => void;
  onVolumeChange: (vol: number) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export function MusicPlayer({
  currentTrackIndex,
  isPlaying,
  volume,
  onPlayPause,
  onSkipNext,
  onSkipPrev,
  onVolumeChange,
  audioRef
}: MusicPlayerProps) {
  const currentTrack = PLAYLIST[currentTrackIndex];

  return (
    <div className="flex w-full items-center justify-between font-sans">
      {/* Left: Track Info */}
      <div className="flex items-center gap-4 w-1/4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-1 shrink-0">
          <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden">
            {isPlaying ? (
              <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-slate-500 border-t-transparent"></div>
            )}
          </div>
        </div>
        <div className="truncate text-left">
          <div className="text-sm font-bold truncate text-slate-100">{currentTrack.title}</div>
          <div className="text-xs text-slate-400 truncate">{currentTrack.artist}</div>
        </div>
      </div>

      {/* Center: Controls */}
      <div className="flex flex-col items-center gap-3 w-1/2">
        <div className="flex items-center gap-8">
          <button 
            onClick={onSkipPrev}
            className="text-slate-400 hover:text-white transition-colors"
          >
             <SkipBack className="w-5 h-5" />
          </button>
          <button 
            onClick={onPlayPause}
            className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          <button 
            onClick={onSkipNext}
            className="text-slate-400 hover:text-white transition-colors"
          >
             <SkipForward className="w-5 h-5" />
          </button>
        </div>
        <div className="w-full max-w-md flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-500">0:00</span>
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-gradient-to-r from-cyan-400 to-blue-500 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-500">{currentTrack.duration}</span>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="w-1/4 flex justify-end gap-6 items-center text-slate-400">
        <div className="flex items-center gap-2">
          <button onClick={() => onVolumeChange(volume === 0 ? 0.5 : 0)} className="hover:text-white transition-colors">
            {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div className="w-24 group relative">
             <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden pointer-events-none mt-1.5">
              <div className="h-full bg-white/40" style={{ width: `${volume * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onEnded={onSkipNext}
        onPlay={() => {}}
        onPause={() => {}}
      />
    </div>
  );
}
