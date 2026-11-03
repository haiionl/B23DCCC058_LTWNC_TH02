import React, { useMemo } from 'react';
import { useSavedStore } from './useSavedStore';
import { EXERCISES } from '../../data/exercises';
import { useSessionStore } from '../session/useSessionStore';
import { formatDuration } from '../../utils/format';

export const SavedPage: React.FC = () => {
  const savedIds = useSavedStore((s) => s.ids);
  const toggleSave = useSavedStore((s) => s.toggle);
  const startSession = useSessionStore((s) => s.startSession);
  const addToSession = useSessionStore((s) => s.addToSession);

  const savedExercises = useMemo(() => {
    const idSet = new Set(savedIds);
    return EXERCISES.filter((ex) => idSet.has(ex.id));
  }, [savedIds]);

  const handleStartAll = () => {
    if (savedExercises.length > 0) {
      startSession(savedExercises, 0);
    }
  };

  const handleStartOne = (index: number) => {
    startSession(savedExercises, index);
  };

  return (
    <div className="saved-page page-container">
      <header className="page-header saved-header">
        <h1>Bài tập đã lưu</h1>
        {savedExercises.length > 0 && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleStartAll}
          >
            Tập tất cả
          </button>
        )}
      </header>

      {savedExercises.length === 0 ? (
        <p className="no-data-msg">Bạn chưa lưu bài tập nào</p>
      ) : (
        <div className="saved-list">
          <div className="list-header">
            <span className="col-index">STT</span>
            <span className="col-name">Tên bài tập</span>
            <span className="col-trainer">Huấn luyện viên</span>
            <span className="col-group">Nhóm cơ</span>
            <span className="col-duration">Thời lượng</span>
            <span className="col-actions">Hành động</span>
          </div>
          {savedExercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className="exercise-row standard-row"
              data-testid={`saved-row-${exercise.id}`}
            >
              <span className="exercise-col col-index">#{index + 1}</span>
              <span className="exercise-col col-name">{exercise.name}</span>
              <span className="exercise-col col-trainer">{exercise.trainer}</span>
              <span className="exercise-col col-group">{exercise.group}</span>
              <span className="exercise-col col-duration">
                {formatDuration(exercise.duration)}
              </span>
              <div className="exercise-col col-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleStartOne(index)}
                >
                  Bắt đầu
                </button>
                <button
                  type="button"
                  className="btn btn-star"
                  aria-label="Bỏ lưu"
                  onClick={() => toggleSave(exercise.id)}
                >
                  ★
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => addToSession(exercise)}
                >
                  + Buổi tập
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPage;
