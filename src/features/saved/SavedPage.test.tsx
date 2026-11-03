import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SavedPage } from './SavedPage';
import { useSavedStore } from './useSavedStore';
import { useSessionStore } from '../session/useSessionStore';

describe('Component SavedPage', () => {
  beforeEach(() => {
    useSavedStore.setState({ ids: [] });
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    });
  });

  it('hiển thị thông báo khi chưa lưu bài tập nào', () => {
    render(<SavedPage />);
    expect(screen.getByText('Bạn chưa lưu bài tập nào')).toBeInTheDocument();
  });

  it('liệt kê các bài đã lưu và hỗ trợ nút Bỏ lưu, Tập tất cả', async () => {
    const user = userEvent.setup();
    useSavedStore.setState({ ids: ['e1', 'e2'] });

    render(<SavedPage />);

    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
    expect(screen.getByText('Kéo tạ đơn 1')).toBeInTheDocument();

    // Bấm Tập tất cả
    const startAllBtn = screen.getByRole('button', { name: 'Tập tất cả' });
    await user.click(startAllBtn);
    expect(useSessionStore.getState().queue).toHaveLength(2);
    expect(useSessionStore.getState().isRunning).toBe(true);

    // Bỏ lưu bài đầu tiên
    const unstarBtns = screen.getAllByRole('button', { name: 'Bỏ lưu' });
    await user.click(unstarBtns[0]);
    expect(useSavedStore.getState().ids).toEqual(['e2']);
  });
});
