import React, { memo, useCallback, useMemo, useState } from 'react';
import { FixedSizeList, type ListChildComponentProps } from 'react-window';
import { EXERCISES, GROUPS } from '../../data/exercises';
import type { Exercise } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';
import { ExerciseRow } from './ExerciseRow';
import { useSessionStore } from '../session/useSessionStore';
import { useSavedStore } from '../saved/useSavedStore';
import { useRoutines, useRoutineDispatch } from '../routines/RoutineContext';

interface RowItemData {
  items: Exercise[];
  savedIdsSet: Set<string>;
  selectedRoutineId: string;
  onStart: (exercise: Exercise) => void;
  onAddToSession: (exercise: Exercise) => void;
  onToggleSave: (id: string) => void;
  onAddToRoutine: (exerciseId: string) => void;
}

const RowRenderer = memo(
  ({ index, style, data }: ListChildComponentProps<RowItemData>) => {
    const item = data.items[index];
    if (!item) return null;
    return (
      <ExerciseRow
        exercise={item}
        index={index}
        isSaved={data.savedIdsSet.has(item.id)}
        selectedRoutineId={data.selectedRoutineId}
        onStart={data.onStart}
        onAddToSession={data.onAddToSession}
        onToggleSave={data.onToggleSave}
        onAddToRoutine={data.onAddToRoutine}
        style={style}
      />
    );
  }
);
RowRenderer.displayName = 'RowRenderer';

export const LibraryPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState<string>('Tất cả');
  const [sortFilter, setSortFilter] = useState<string>('default');
  const [selectedRoutineId, setSelectedRoutineId] = useState<string>('');

  const debouncedSearch = useDebounce(search, 300);

  const startSession = useSessionStore((s) => s.startSession);
  const addToSession = useSessionStore((s) => s.addToSession);
  const savedIds = useSavedStore((s) => s.ids);
  const toggleSave = useSavedStore((s) => s.toggle);

  const routines = useRoutines();
  const dispatchRoutine = useRoutineDispatch();

  // Mandatory function naming requirement:
  const handleKeywordShift = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredExercises = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    let list = EXERCISES;

    if (query) {
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.trainer.toLowerCase().includes(query)
      );
    }

    if (groupFilter !== 'Tất cả') {
      list = list.filter((item) => item.group === groupFilter);
    }

    if (sortFilter === 'name') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }

    if (sortFilter === 'duration') {
      return [...list].sort((a, b) => a.duration - b.duration);
    }

    return list;
  }, [debouncedSearch, groupFilter, sortFilter]);

  const handleStart = useCallback(
    (exercise: Exercise) => {
      const idx = filteredExercises.findIndex((e) => e.id === exercise.id);
      startSession(filteredExercises, idx >= 0 ? idx : 0);
    },
    [filteredExercises, startSession]
  );

  const handleAddToSession = useCallback(
    (exercise: Exercise) => {
      addToSession(exercise);
    },
    [addToSession]
  );

  const handleToggleSave = useCallback(
    (id: string) => {
      toggleSave(id);
    },
    [toggleSave]
  );

  const handleAddToRoutine = useCallback(
    (exerciseId: string) => {
      if (!selectedRoutineId) return;
      dispatchRoutine({
        type: 'addExercise',
        payload: { routineId: selectedRoutineId, exerciseId },
      });
    },
    [selectedRoutineId, dispatchRoutine]
  );

  const savedIdsSet = useMemo(() => new Set(savedIds), [savedIds]);

  const itemData: RowItemData = useMemo(
    () => ({
      items: filteredExercises,
      savedIdsSet,
      selectedRoutineId,
      onStart: handleStart,
      onAddToSession: handleAddToSession,
      onToggleSave: handleToggleSave,
      onAddToRoutine: handleAddToRoutine,
    }),
    [
      filteredExercises,
      savedIdsSet,
      selectedRoutineId,
      handleStart,
      handleAddToSession,
      handleToggleSave,
      handleAddToRoutine,
    ]
  );

  const getItemKey = useCallback(
    (index: number, data: RowItemData) => data.items[index]?.id || index,
    []
  );

  return (
    <div className="library-page page-container">
      <header className="page-header">
        <h1>Kho bài tập</h1>
      </header>

      <section className="filter-controls">
        <div className="form-group search-group">
          <label htmlFor="search-input">Tìm kiếm</label>
          <input
            id="search-input"
            type="text"
            placeholder="Tìm theo tên bài hoặc huấn luyện viên..."
            value={search}
            onChange={handleKeywordShift}
          />
        </div>

        <div className="form-group select-group">
          <label htmlFor="group-select">Nhóm cơ</label>
          <select
            id="group-select"
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
          >
            <option value="Tất cả">Tất cả</option>
            {GROUPS.map((grp) => (
              <option key={grp} value={grp}>
                {grp}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group select-group">
          <label htmlFor="sort-select">Sắp xếp</label>
          <select
            id="sort-select"
            value={sortFilter}
            onChange={(e) => setSortFilter(e.target.value)}
          >
            <option value="default">Mặc định</option>
            <option value="name">Tên A–Z</option>
            <option value="duration">Thời lượng tăng dần</option>
          </select>
        </div>

        <div className="form-group select-group">
          <label htmlFor="routine-select">Giáo án đang chọn</label>
          <select
            id="routine-select"
            value={selectedRoutineId}
            onChange={(e) => setSelectedRoutineId(e.target.value)}
          >
            <option value="">-- Chưa chọn giáo án --</option>
            {routines.map((routine) => (
              <option key={routine.id} value={routine.id}>
                {routine.name} ({routine.exerciseIds.length} bài)
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className="results-summary">
        {filteredExercises.length === 0 ? (
          <p className="no-results">Không tìm thấy bài tập nào</p>
        ) : (
          <p className="results-count">
            Tìm thấy {filteredExercises.length} bài tập
          </p>
        )}
      </div>

      {filteredExercises.length > 0 && (
        <div className="virtual-list-container">
          <div className="list-header">
            <span className="col-index">STT</span>
            <span className="col-name">Tên bài tập</span>
            <span className="col-trainer">Huấn luyện viên</span>
            <span className="col-group">Nhóm cơ</span>
            <span className="col-duration">Thời lượng</span>
            <span className="col-actions">Hành động</span>
          </div>
          <FixedSizeList
            height={560}
            itemCount={filteredExercises.length}
            itemSize={56}
            itemKey={getItemKey}
            itemData={itemData}
            width="100%"
          >
            {RowRenderer}
          </FixedSizeList>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
