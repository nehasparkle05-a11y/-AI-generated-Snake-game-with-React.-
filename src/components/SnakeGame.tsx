import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 120;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const directionRef = useRef(direction);
  
  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && isGameOver) {
        resetGame();
        return;
      }
      
      if (e.key === ' ' && !isGameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (isPaused || isGameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, isGameOver]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
      setDirection(directionRef.current);
    };

    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [isPaused, isGameOver, food, generateFood, highScore]);

  return (
    <div className="flex flex-col items-center bg-black p-6 border-4 border-[#00FFFF] shadow-[8px_8px_0px_#FF00FF] relative font-digital">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#FF00FF] animate-pulse"></div>
      
      <div className="flex justify-between items-center w-full mb-4 px-2 border-b-2 border-[#00FFFF] pb-2">
        <div className="flex flex-col">
          <span className="text-[#FF00FF] text-xl uppercase tracking-widest">DATA_STREAM</span>
          <span className="text-4xl font-black text-[#00FFFF]">{score}</span>
        </div>
        <div className="text-center hidden sm:block">
          <p className="text-[#00FFFF] tracking-widest uppercase text-xl bg-[#FF00FF] text-black px-2 py-1 font-bold">
            SECTOR_7G
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#FF00FF] text-xl uppercase tracking-widest flex items-center gap-2">
            <Trophy size={18} /> PEAK_OUTPUT
          </span>
          <span className="text-4xl font-black text-[#00FFFF]">{highScore}</span>
        </div>
      </div>

      <div 
        className="relative bg-black border-2 border-[#FF00FF] overflow-hidden"
        style={{ 
          width: 'min(100vw - 3rem, 400px)', 
          height: 'min(100vw - 3rem, 400px)' 
        }}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#00FFFF 1px, transparent 1px), linear-gradient(90deg, #00FFFF 1px, transparent 1px)',
            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className="absolute bg-[#00FFFF] border border-black"
            style={{
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              zIndex: index === 0 ? 10 : 5,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-[#FF00FF] animate-ping"
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
          }}
        />
        <div
          className="absolute bg-[#FF00FF]"
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
          }}
        />

        {/* Overlays */}
        {(isPaused || isGameOver) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 border-4 border-[#FF00FF] m-2">
            {isGameOver ? (
              <>
                <h2 
                  className="text-6xl md:text-7xl text-[#FF00FF] mb-2 uppercase glitch font-bold"
                  data-text="FATAL_ERROR"
                >
                  FATAL_ERROR
                </h2>
                <p className="text-[#00FFFF] mb-6 text-3xl">OUTPUT_LOG: {score}</p>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 px-6 py-3 bg-black border-2 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black font-bold uppercase tracking-widest transition-none text-2xl"
                >
                  <RotateCcw size={24} /> REBOOT_SYSTEM
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsPaused(false)}
                className="flex items-center gap-2 px-8 py-4 bg-black border-2 border-[#FF00FF] text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black font-bold uppercase tracking-widest transition-none text-3xl"
              >
                <Play size={32} fill="currentColor" /> INITIATE_SEQUENCE
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-6 text-center text-[#00FFFF] text-xl uppercase tracking-widest">
        INPUT_VECTOR: <span className="text-[#FF00FF] bg-black px-2 border border-[#FF00FF]">WASD</span> // <span className="text-[#FF00FF] bg-black px-2 border border-[#FF00FF]">ARROWS</span><br/>
        INTERRUPT: <span className="text-[#FF00FF] bg-black px-2 border border-[#FF00FF]">SPACE</span>
      </div>
    </div>
  );
}
