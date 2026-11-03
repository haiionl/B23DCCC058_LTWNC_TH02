import React, { memo, useState } from 'react';
import type { Exercise } from '../../types';
import { formatDuration } from '../../utils/format';

export interface ExerciseRowProps {
  exercise: Exercise;
  index: number;
  isSaved?: boolean;
  selectedRoutineId?: string;
  onStart?: (exercise: Exercise) => void;
  onToggleSave?: (id: string) => void;
  onAddToSession?: (exercise: Exercise) => void;
  onAddToRoutine?: (exerciseId: string) => void;
  style?: React.CSSProperties;
}

export const ExerciseRow: React.FC<ExerciseRowProps> = memo(
  ({
    exercise,
    index,
    isSaved = false,
    selectedRoutineId = '',
    onStart,
    onToggleSave,
    onAddToSession,
    onAddToRoutine,
    style,
  }) => {
    const [addedSession, setAddedSession] = useState(false);
    const [addedRoutine, setAddedRoutine] = useState(false);

    const handleAddSession = () => {
      onAddToSession?.(exercise);
      setAddedSession(true);
      setTimeout(() => setAddedSession(false), 1200);
    };

    const handleAddRoutine = () => {
      onAddToRoutine?.(exercise.id);
      setAddedRoutine(true);
      setTimeout(() => setAddedRoutine(false), 1200);
    };

    return (
      <div
        className="exercise-row"
        style={style}
        data-testid={`exercise-row-${exercise.id}`}
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
            onClick={() => onStart?.(exercise)}
          >
            Bắt đầu
          </button>
          <button
            type="button"
            className="btn btn-star"
            aria-label={isSaved ? 'Bỏ lưu' : 'Lưu bài tập'}
            onClick={() => onToggleSave?.(exercise.id)}
          >
            {isSaved ? '★' : '☆'}
          </button>
          <button
            type="button"
            className={`btn ${addedSession ? 'btn-success' : 'btn-secondary'}`}
            onClick={handleAddSession}
          >
            {addedSession ? '✓ Đã thêm' : '+ Buổi tập'}
          </button>
          <button
            type="button"
            className={`btn ${addedRoutine ? 'btn-success' : 'btn-secondary'}`}
            disabled={!selectedRoutineId}
            onClick={handleAddRoutine}
          >
            {addedRoutine ? '✓ Đã thêm' : '+ Giáo án'}
          </button>
        </div>
      </div>
    );
  }
);

ExerciseRow.displayName = 'ExerciseRow';
