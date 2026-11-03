import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRoutines, useRoutineDispatch } from './RoutineContext';
import { EXERCISES } from '../../data/exercises';
import { useSessionStore } from '../session/useSessionStore';
import { formatDuration } from '../../utils/format';
import type { Exercise } from '../../types';

export const RoutineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();
  const startSession = useSessionStore((s) => s.startSession);

  const routine = useMemo(
    () => routines.find((r) => r.id === id),
    [routines, id]
  );

  const routineExercises = useMemo(() => {
    if (!routine) return [];
    const exerciseMap = new Map<string, Exercise>();
    for (const ex of EXERCISES) {
      exerciseMap.set(ex.id, ex);
    }
    return routine.exerciseIds
      .map((exId) => exerciseMap.get(exId))
      .filter((ex): ex is Exercise => ex !== undefined);
  }, [routine]);

  if (!routine) {
    return (
      <div className="routine-detail-page page-container">
        <p className="no-data-msg">Không tìm thấy giáo án</p>
        <Link to="/routines" className="btn btn-secondary link-btn">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const totalSeconds = routineExercises.reduce(
    (sum, ex) => sum + ex.duration,
    0
  );
  const totalMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  const handleStartAll = () => {
    if (routineExercises.length > 0) {
      startSession(routineExercises, 0);
    }
  };

  const handleRemoveExercise = (exerciseId: string) => {
    dispatch({
      type: 'removeExercise',
      payload: { routineId: routine.id, exerciseId },
    });
  };

  return (
    <div className="routine-detail-page page-container">
      <header className="page-header routine-detail-header">
        <div>
          <Link to="/routines" className="back-link">
            ← Quay lại danh sách
          </Link>
          <h1>{routine.name}</h1>
        </div>
        {routineExercises.length > 0 && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleStartAll}
          >
            Tập tất cả
          </button>
        )}
      </header>

      <div className="routine-summary-box">
        <p className="routine-time">
          Tổng thời gian: {totalMinutes} phút {remainingSeconds} giây
        </p>
      </div>

      <div className="routine-exercise-list">
        {routineExercises.length === 0 ? (
          <p className="no-data-msg">Chưa có bài tập nào trong giáo án này</p>
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
            {routineExercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="exercise-row standard-row"
                data-testid={`routine-exercise-row-${exercise.id}`}
              >
                <span className="exercise-col col-index">#{index + 1}</span>
                <span className="exercise-col col-name">{exercise.name}</span>
                <span className="exercise-col col-trainer">
                  {exercise.trainer}
                </span>
                <span className="exercise-col col-group">{exercise.group}</span>
                <span className="exercise-col col-duration">
                  {formatDuration(exercise.duration)}
                </span>
                <div className="exercise-col col-actions">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleRemoveExercise(exercise.id)}
                  >
                    Bỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutineDetailPage;
