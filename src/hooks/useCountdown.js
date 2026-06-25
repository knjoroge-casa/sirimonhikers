import { useState, useEffect } from 'react';

const useCountdown = (targetDate, targetTime) => {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!targetDate) return;

    const calculate = () => {
      const now = new Date();

      let hours = 0;
      let minutes = 0;

      if (targetTime) {
        const timeStr = targetTime.toLowerCase().trim();
        const match = timeStr.match(/(\d+):(\d+)\s*(am|pm)?/);

        if (match) {
          hours = parseInt(match[1]);
          minutes = parseInt(match[2]);
          const ampm = match[3];

          if (ampm === 'pm' && hours !== 12) hours += 12;
          if (ampm === 'am' && hours === 12) hours = 0;
        }
      }

      const target = new Date(targetDate + 'T' + String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ':00');
      const diff = target - now;

      if (diff <= 0) {
        const daysPast = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
        if (daysPast === 0) {
          setCountdown('Today!');
        } else if (daysPast === 1) {
          setCountdown('Yesterday');
        } else {
          setCountdown(`${daysPast} days ago`);
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setCountdown(`${days}d ${hrs}h ${mins}m`);
      } else {
        setCountdown(`${hrs}h ${mins}m`);
      }
    };

    calculate();
    const interval = setInterval(calculate, 60000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  return countdown;
};

export default useCountdown;
