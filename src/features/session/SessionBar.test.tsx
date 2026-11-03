import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { SessionBar } from './SessionBar';
import { useSessionStore } from './useSessionStore';
import type { Exercise } from '../../types';

describe('Component SessionBar và CountdownBar', () => {
  const mockExercises: Exercise[] = [
    {
      id: 'e1',
      name: 'Đẩy tạ đơn 1',
      trainer: 'Minh Khang',
      group: 'Ngực',
      duration: 30,
    },
    {
      id: 'e2',
      name: 'Kéo tạ đơn 1',
      trainer: 'Phương Anh',
      group: 'Chân',
      duration: 67,
    },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('hiển thị Chưa bắt đầu buổi tập khi chưa có bài tập', () => {
    render(<SessionBar />);
    expect(screen.getByText('Chưa bắt đầu buổi tập')).toBeInTheDocument();
    expect(screen.getByText('Buổi tập: 0 bài')).toBeInTheDocument();
  });

  it('hiển thị thông tin bài đang tập và cập nhật thời gian còn lại khi chạy', () => {
    useSessionStore.getState().startSession(mockExercises, 0);

    render(<SessionBar />);

    expect(
      screen.getByText('Đang tập: Đẩy tạ đơn 1 – HLV Minh Khang')
    ).toBeInTheDocument();
    expect(screen.getByText('Còn lại: 0:30')).toBeInTheDocument();
    expect(screen.getByText('Buổi tập: 2 bài')).toBeInTheDocument();

    // Đồng hồ chạy 5 giây
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('Còn lại: 0:25')).toBeInTheDocument();
  });

  it('các nút điều khiển Trước, Tạm dừng/Bắt đầu, Sau hoạt động đúng', () => {
    useSessionStore.getState().startSession(mockExercises, 0);

    render(<SessionBar />);

    // Bấm Tạm dừng
    const pauseBtn = screen.getByRole('button', { name: 'Tạm dừng' });
    fireEvent.click(pauseBtn);
    expect(useSessionStore.getState().isRunning).toBe(false);

    // Bấm Sau
    const nextBtn = screen.getByRole('button', { name: 'Sau' });
    fireEvent.click(nextBtn);
    expect(useSessionStore.getState().currentIndex).toBe(1);

    // Bấm Trước
    const prevBtn = screen.getByRole('button', { name: 'Trước' });
    fireEvent.click(prevBtn);
    expect(useSessionStore.getState().currentIndex).toBe(0);
  });
});
