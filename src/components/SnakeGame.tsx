import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 150;

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setIsGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, SPEED);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="relative flex flex-col items-center">
      <div 
        className="grid bg-black/50 border-2 border-neon-cyan/30 rounded-lg overflow-hidden backdrop-blur-sm"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(80vw, 400px)',
          height: 'min(80vw, 400px)',
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.slice(1).some(s => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`w-full h-full border-[0.5px] border-white/5 ${
                isSnakeHead ? 'bg-neon-cyan shadow-[0_0_10px_#00f3ff]' : 
                isSnakeBody ? 'bg-neon-cyan/40' : 
                isFood ? 'bg-neon-magenta shadow-[0_0_10px_#ff00ff] rounded-full scale-75' : ''
              }`}
            />
          );
        })}
      </div>

      {(isGameOver || isPaused) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md rounded-lg">
          <div className="text-center p-8">
            {isGameOver ? (
              <>
                <h2 className="text-4xl font-bold text-neon-magenta mb-4 neon-text-magenta">GAME OVER</h2>
                <p className="text-xl text-white mb-6">Final Score: {score}</p>
                <button 
                  onClick={resetGame}
                  className="px-6 py-2 bg-neon-cyan text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_#00f3ff]"
                >
                  TRY AGAIN
                </button>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-neon-cyan mb-4 neon-text-cyan">PAUSED</h2>
                <p className="text-white mb-6">Press SPACE or click below to start</p>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="px-6 py-2 bg-neon-green text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_#39ff14]"
                >
                  PLAY NOW
                </button>
              </>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-4 flex gap-4 text-xs text-white/50 font-mono">
        <span>ARROW KEYS TO MOVE</span>
        <span>•</span>
        <span>SPACE TO PAUSE</span>
      </div>
    </div>
  );
}
