import React, { useEffect } from 'react';
import { useSessionStore } from './useSessionStore';
import { CountdownBar } from './CountdownBar';

export const SessionBar: React.FC = () => {
  const isRunning = useSessionStore((s) => s.isRunning);
  const tick = useSessionStore((s) => s.tick);
  const toggleRun = useSessionStore((s) => s.toggleRun);
  const next = useSessionStore((s) => s.next);
  const prev = useSessionStore((s) => s.prev);
  const queueLength = useSessionStore((s) => s.queue.length);
  const currentExercise = useSessionStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length
      ? s.queue[s.currentIndex]
      : null
  );

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, tick]);

  return (
    <footer className="session-bar" role="region" aria-label="Thanh đồng hồ buổi tập">
      <div className="session-info">
        {currentExercise ? (
          <span className="current-exercise">
            Đang tập: {currentExercise.name} – HLV {currentExercise.trainer}
          </span>
        ) : (
          <span className="current-exercise">Chưa bắt đầu buổi tập</span>
        )}
      </div>

      <div className="session-countdown">
        <CountdownBar />
      </div>

      <div className="session-controls">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={prev}
          disabled={queueLength === 0}
        >
          Trước
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={toggleRun}
          disabled={queueLength === 0}
        >
          {isRunning ? 'Tạm dừng' : 'Bắt đầu'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={next}
          disabled={queueLength === 0}
        >
          Sau
        </button>
      </div>

      <div className="session-queue-count">
        Buổi tập: {queueLength} bài
      </div>
    </footer>
  );
};
