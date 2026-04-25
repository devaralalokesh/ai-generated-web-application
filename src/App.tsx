import { useState, useRef, useEffect } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { PLAYLIST } from './constants';

export default function App() {
  const [score, setScore] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync volume state with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle play/pause logic safely
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Playback failed (likely due to missing user interaction):", err);
          setIsPlaying(false);
        });
    }
  };

  const handleSkipNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    // Auto-play the next track if we were already playing
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        audioRef.current?.play().catch(console.error);
      }, 50);
    }
  };

  const handleSkipPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        audioRef.current?.play().catch(console.error);
      }, 50);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden relative font-sans w-full">
      {/* Animated Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Top Header Navigation */}
      <header className="h-16 px-8 flex flex-shrink-0 items-center justify-between border-b border-white/10 backdrop-blur-xl bg-slate-900/40 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-400 rounded flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.6)]">
            <div className="w-4 h-4 bg-slate-900 rotate-45"></div>
          </div>
          <span className="text-xl font-black tracking-tighter italic">SYNTH<span className="text-cyan-400">SNAKE</span></span>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
             <span className="text-[10px] uppercase tracking-widest text-slate-400">Current Score</span>
             <span className="text-xl font-mono text-cyan-400">{score.toString().padStart(4, '0')}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden z-10 relative">
        {/* Left Sidebar: Playlist & Stats */}
        <aside className="w-72 border-r border-white/5 bg-slate-900/20 backdrop-blur-md p-6 flex flex-col gap-6 overflow-y-auto">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Neural Audio Feed</h2>
          
          <div className="flex flex-col gap-3">
            {PLAYLIST.map((track, i) => (
              <div 
                key={track.id} 
                onClick={() => {
                  setCurrentTrackIndex(i);
                  if (isPlaying && audioRef.current) {
                    setTimeout(() => audioRef.current?.play().catch(console.error), 50);
                  }
                }}
                className={`p-4 rounded-xl flex gap-4 items-center cursor-pointer transition-colors ${
                  i === currentTrackIndex 
                    ? 'bg-cyan-500/10 border border-cyan-500/30 shadow-lg relative' 
                    : 'bg-white/5 border border-white/5 hover:bg-white/10'
                }`}
              >
                {i === currentTrackIndex ? (
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-cyan-400/20 flex items-center justify-center relative">
                    <div className="w-1 h-4 bg-cyan-400 rounded-full mx-0.5 animate-pulse"></div>
                    <div className="w-1 h-6 bg-cyan-400 rounded-full mx-0.5 animate-pulse" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1 h-3 bg-cyan-400 rounded-full mx-0.5 animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  </div>
                ) : (
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500">
                    <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                )}
                <div className="truncate">
                  <div className={`text-sm font-bold truncate ${i === currentTrackIndex ? 'text-cyan-50' : 'text-slate-200'}`}>
                    {track.title}
                  </div>
                  <div className={`text-[10px] truncate ${i === currentTrackIndex ? 'text-cyan-400/70' : 'text-slate-500'}`}>
                    {track.artist}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10">
            <div className="text-[10px] font-bold uppercase mb-2">Session Data</div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Audio Sync</span>
              <span className={isPlaying ? 'text-cyan-400' : 'text-rose-400'}>{isPlaying ? 'ACTIVE' : 'SUSPENDED'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">System Clock</span>
              <span className="text-cyan-400">{new Date().toISOString().split('T')[1].substring(0,8)}Z</span>
            </div>
          </div>
        </aside>

        {/* Main Window: Snake Game */}
        <section className="flex-1 p-8 flex flex-col items-center justify-center relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:32px_32px]">
          <div className="w-full flex justify-between items-end mb-4 font-mono text-xs tracking-widest px-1 text-slate-400 max-w-[500px]">
            <span className="text-cyan-400">TERMINAL_0</span>
          </div>
          
          <div className="relative w-full max-w-[500px]">
             <SnakeGame onScoreUpdate={setScore} isPlaying={isPlaying} />
          </div>
          
          <div className="mt-8 text-center font-mono text-slate-500 text-xs tracking-widest">
            [ W A S D ] OR [ ▲ ▼ ◄ ► ] TO INTERFACE
          </div>
        </section>
      </main>

      {/* Bottom Player Bar */}
      <footer className="h-24 px-8 border-t border-white/10 bg-slate-900/60 backdrop-blur-2xl flex items-center justify-between z-10 w-full relative shrink-0">
        <MusicPlayer 
            currentTrackIndex={currentTrackIndex}
            isPlaying={isPlaying}
            volume={volume}
            onPlayPause={togglePlayPause}
            onSkipNext={handleSkipNext}
            onSkipPrev={handleSkipPrev}
            onVolumeChange={setVolume}
            audioRef={audioRef}
          />
      </footer>
    </div>
  );
}
