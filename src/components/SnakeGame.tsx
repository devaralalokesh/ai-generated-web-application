import { useEffect, useRef, useState } from 'react';
import { GRID_SIZE, INITIAL_DIRECTION, INITIAL_SNAKE, Position } from '../constants';

export function SnakeGame({ onScoreUpdate, isPlaying }: { onScoreUpdate: (s: number) => void, isPlaying: boolean }) {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(!isPlaying);

  const directionRef = useRef(direction);
  
  useEffect(() => {
    setIsPaused(!isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = (currentSnake: Position[]): Position => {
    let newFood: Position;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on the snake
      const isOnSnake = currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    onScoreUpdate(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling when playing
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (directionRef.current.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (directionRef.current.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (directionRef.current.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (directionRef.current.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check Wall Collision (Wrap around or die? Let's do die for retro feel)
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood(newSnake));
          onScoreUpdate((newSnake.length - INITIAL_SNAKE.length) * 10);
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, 120); // Speed
    return () => clearInterval(gameInterval);
  }, [food, gameOver, isPaused, onScoreUpdate]);

  return (
    <div className="relative w-full aspect-square bg-slate-900/80 border-2 border-white/10 rounded-3xl backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* Background Grid Lines inside the box */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{
             backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
             backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
           }}>
      </div>
      
      <div 
        className="w-full h-full grid relative z-10"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
        }}
      >
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`rounded-sm z-20 ${
                isHead 
                  ? 'bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,1)] flex items-center justify-center -m-0.5' 
                  : 'bg-cyan-400/80 border border-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
              }`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
              }}
            >
              {isHead && (
                <>
                  <div className="w-1 h-1 bg-slate-900 rounded-full mx-0.5"></div>
                  <div className="w-1 h-1 bg-slate-900 rounded-full mx-0.5"></div>
                </>
              )}
            </div>
          );
        })}
        
        <div
          className="bg-rose-500 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.8)] animate-pulse z-20 relative"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        >
           <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-rose-300 rounded-full blur-[1px] opacity-50"></div>
        </div>
      </div>

      {gameOver && (
        <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-6 z-30 backdrop-blur-sm">
          <h2 className="text-3xl text-rose-500 font-bold mb-6 tracking-widest text-center shadow-[0_0_20px_rgba(244,63,94,0.3)]">SYS.FAIL::GAME_OVER</h2>
          <button 
            onClick={resetGame}
            className="px-6 py-3 rounded-full bg-cyan-500 text-slate-900 hover:bg-cyan-400 transition-colors text-sm uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(34,211,238,0.5)]"
          >
            Reboot Sequence
          </button>
        </div>
      )}

      {isPaused && !gameOver && (
        <div className="absolute inset-0 bg-slate-900/50 flex flex-col items-center justify-center z-30 backdrop-blur-sm">
          <h2 className="text-xl text-cyan-400 animate-pulse tracking-widest font-mono">AWAITING_INPUT...</h2>
        </div>
      )}
      
      {/* HUD Overlay */}
      <div className="absolute bottom-6 left-6 text-[10px] font-mono text-white/40 tracking-widest z-10 pointer-events-none">
        RENDER_BUFFER: ACTIVE
      </div>
    </div>
  );
}
