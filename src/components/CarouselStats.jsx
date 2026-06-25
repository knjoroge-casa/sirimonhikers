import React, { useState, useCallback, useEffect } from 'react';
import { CAROUSEL_STATS } from '../constants/carouselStats';

const CarouselStats = () => {
  const [current, setCurrent] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [direction, setDirection] = useState('left');
  const [isPaused, setIsPaused] = useState(false);
  const total = CAROUSEL_STATS.length;

  const goTo = useCallback((index, dir = 'left') => {
    if (sliding) return;
    setDirection(dir);
    setSliding(true);
    setTimeout(() => {
      setCurrent(index);
      setSliding(false);
    }, 300);
  }, [sliding]);

  const goNext = useCallback(() => {
    goTo((current + 1) % total, 'left');
  }, [current, total, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + total) % total, 'right');
  }, [current, total, goTo]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(goNext, 4000);
    return () => clearInterval(timer);
  }, [isPaused, goNext]);

  const stat = CAROUSEL_STATS[current];

  return (
    <div
      className="glass-dark rounded-2xl p-4 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex flex-col items-center gap-2 transition-all duration-300"
        style={{
          opacity: sliding ? 0 : 1,
          transform: sliding
            ? `translateX(${direction === 'left' ? '-20px' : '20px'})`
            : 'translateX(0)',
        }}
      >
        <span className="text-3xl flex-shrink-0">{stat.icon}</span>
        <div className="flex-1 min-w-0 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">{stat.label}</p>
          <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          <p className="text-sm text-gray-500">{stat.suffix}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button onClick={goPrev} className="text-gray-400 hover:text-gray-700 transition p-1">
          ‹
        </button>
        <div className="flex gap-1.5">
          {CAROUSEL_STATS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 'left' : 'right')}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{ backgroundColor: i === current ? '#6B8E23' : '#d1d5db' }}
            />
          ))}
        </div>
        <button onClick={goNext} className="text-gray-400 hover:text-gray-700 transition p-1">
          ›
        </button>
      </div>
    </div>
  );
};

export default CarouselStats;
