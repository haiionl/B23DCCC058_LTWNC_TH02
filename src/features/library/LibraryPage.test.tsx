import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { LibraryPage } from './LibraryPage';
import { RoutineProvider } from '../routines/RoutineContext';
import { useSessionStore } from '../session/useSessionStore';
import { useSavedStore } from '../saved/useSavedStore';
import type { Routine } from '../routines/routineReducer';

describe('Component LibraryPage', () => {
  const initialRoutines: Routine[] = [
    { id: 'r1', name: 'Giáo án mẫu', exerciseIds: [] },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    });
    useSavedStore.setState({ ids: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderLibrary = () => {
    return render(
      <RoutineProvider initialRoutines={initialRoutines}>
        <LibraryPage />
      </RoutineProvider>
    );
  };

  it('hiển thị tiêu đề và số lượng bài ban đầu là 10000', () => {
    renderLibrary();
    expect(screen.getByText('Kho bài tập')).toBeInTheDocument();
    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();
  });

  it('tìm kiếm theo từ khóa có debounce 300ms', () => {
    renderLibrary();

    const searchInput = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(searchInput, { target: { value: 'đẩy' } });

    // Chưa hết 300ms (ví dụ 100ms)
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();

    // Sau khi đủ 300ms (thêm 200ms nữa)
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByText('Tìm thấy 1250 bài tập')).toBeInTheDocument();
  });

  it('lọc theo nhóm cơ và sắp xếp theo tên hoặc thời lượng', () => {
    renderLibrary();

    const groupSelect = screen.getByLabelText('Nhóm cơ');
    fireEvent.change(groupSelect, { target: { value: 'Ngực' } });
    expect(screen.getByText('Tìm thấy 2000 bài tập')).toBeInTheDocument();

    const sortSelect = screen.getByLabelText('Sắp xếp');
    fireEvent.change(sortSelect, { target: { value: 'duration' } });
    expect(screen.getByText('Tìm thấy 2000 bài tập')).toBeInTheDocument();

    fireEvent.change(sortSelect, { target: { value: 'name' } });
    expect(screen.getByText('Tìm thấy 2000 bài tập')).toBeInTheDocument();
  });

  it('chọn giáo án và cập nhật giá trị đã chọn', () => {
    renderLibrary();

    const routineSelect = screen.getByLabelText('Giáo án đang chọn');
    fireEvent.change(routineSelect, { target: { value: 'r1' } });

    expect(screen.getByDisplayValue('Giáo án mẫu (0 bài)')).toBeInTheDocument();
  });
});
