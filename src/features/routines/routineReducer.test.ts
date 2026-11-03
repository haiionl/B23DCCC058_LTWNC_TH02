import { describe, it, expect } from 'vitest';
import { routineReducer, type Routine } from './routineReducer';

describe('routineReducer', () => {
  const initialRoutines: Routine[] = [
    {
      id: 'r1',
      name: 'Giáo án ngực',
      exerciseIds: ['e1', 'e2'],
    },
  ];

  it('tạo giáo án mới thành công', () => {
    const action = {
      type: 'create' as const,
      payload: { id: 'r2', name: 'Giáo án chân' },
    };
    const nextState = routineReducer(initialRoutines, action);

    expect(nextState).toHaveLength(2);
    expect(nextState[1]).toEqual({
      id: 'r2',
      name: 'Giáo án chân',
      exerciseIds: [],
    });
  });

  it('addExercise thêm bài tập và không thêm trùng bài', () => {
    const actionAdd = {
      type: 'addExercise' as const,
      payload: { routineId: 'r1', exerciseId: 'e3' },
    };
    const stateAfterAdd = routineReducer(initialRoutines, actionAdd);
    expect(stateAfterAdd[0].exerciseIds).toEqual(['e1', 'e2', 'e3']);

    // Thêm lại bài e3 (đã có)
    const stateAfterDuplicate = routineReducer(stateAfterAdd, actionAdd);
    expect(stateAfterDuplicate[0].exerciseIds).toEqual(['e1', 'e2', 'e3']);
  });

  it('removeExercise xóa đúng bài tập khỏi giáo án', () => {
    const actionRemove = {
      type: 'removeExercise' as const,
      payload: { routineId: 'r1', exerciseId: 'e2' },
    };
    const nextState = routineReducer(initialRoutines, actionRemove);
    expect(nextState[0].exerciseIds).toEqual(['e1']);
  });

  it('xóa giáo án không tồn tại thì state giữ nguyên (toEqual)', () => {
    const actionRemoveNonExistent = {
      type: 'remove' as const,
      payload: { id: 'r-non-existent' },
    };
    const nextState = routineReducer(initialRoutines, actionRemoveNonExistent);
    expect(nextState).toEqual(initialRoutines);
  });

  it('rename đổi tên giáo án', () => {
    const actionRename = {
      type: 'rename' as const,
      payload: { id: 'r1', name: 'Giáo án cơ ngực nâng cao' },
    };
    const nextState = routineReducer(initialRoutines, actionRename);
    expect(nextState[0].name).toBe('Giáo án cơ ngực nâng cao');
  });
});
