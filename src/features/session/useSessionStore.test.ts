import { describe, it, expect, beforeEach } from 'vitest';
import { useSessionStore } from './useSessionStore';
import type { Exercise } from '../../types';

describe('useSessionStore', () => {
  const mockExercises: Exercise[] = [
    {
      id: 'e1',
      name: 'Đẩy ngực',
      trainer: 'Minh Khang',
      group: 'Ngực',
      duration: 30,
    },
    {
      id: 'e2',
      name: 'Kéo xô',
      trainer: 'Thu Trang',
      group: 'Lưng',
      duration: 45,
    },
  ];

  beforeEach(() => {
    // Đặt lại store trước mỗi test bằng useSessionStore.setState(...)
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    });
  });

  it('startSession đặt đúng danh sách bài tập và bắt đầu từ vị trí chỉ định', () => {
    useSessionStore.getState().startSession(mockExercises, 1);

    const state = useSessionStore.getState();
    expect(state.queue).toHaveLength(2);
    expect(state.currentIndex).toBe(1);
    expect(state.isRunning).toBe(true);
    expect(state.elapsed).toBe(0);
  });

  it('tick ở giây cuối tự động chuyển sang bài sau', () => {
    useSessionStore.getState().startSession(mockExercises, 0);
    // e1 có thời lượng 30s. Đặt elapsed = 29 (giây cuối)
    useSessionStore.setState({ elapsed: 29 });

    useSessionStore.getState().tick();

    const state = useSessionStore.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.elapsed).toBe(0);
    expect(state.isRunning).toBe(true);
  });

  it('next ở bài cuối cùng thì isRunning chuyển thành false', () => {
    useSessionStore.getState().startSession(mockExercises, 1);
    expect(useSessionStore.getState().isRunning).toBe(true);

    useSessionStore.getState().next();

    const state = useSessionStore.getState();
    expect(state.isRunning).toBe(false);
  });

  it('prev khi đã tập quá 3 giây thì đặt lại elapsed về 0', () => {
    useSessionStore.getState().startSession(mockExercises, 1);
    useSessionStore.setState({ elapsed: 5 });

    useSessionStore.getState().prev();

    const state = useSessionStore.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.elapsed).toBe(0);
  });

  it('prev khi tập chưa quá 3 giây thì lùi về bài trước', () => {
    useSessionStore.getState().startSession(mockExercises, 1);
    useSessionStore.setState({ elapsed: 2 });

    useSessionStore.getState().prev();

    const state = useSessionStore.getState();
    expect(state.currentIndex).toBe(0);
    expect(state.elapsed).toBe(0);
  });

  it('addToSession thêm bài mới và bỏ qua nếu bài đã có trong danh sách', () => {
    useSessionStore.getState().startSession([mockExercises[0]], 0);

    // Thêm bài chưa có
    useSessionStore.getState().addToSession(mockExercises[1]);
    expect(useSessionStore.getState().queue).toHaveLength(2);

    // Thêm lại bài đã có
    useSessionStore.getState().addToSession(mockExercises[0]);
    expect(useSessionStore.getState().queue).toHaveLength(2);
  });
});
