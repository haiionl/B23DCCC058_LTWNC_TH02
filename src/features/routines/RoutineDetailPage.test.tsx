import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RoutineDetailPage } from './RoutineDetailPage';
import { RoutineProvider } from './RoutineContext';
import { useSessionStore } from '../session/useSessionStore';
import type { Routine } from './routineReducer';

describe('Component RoutineDetailPage', () => {
  const initialRoutines: Routine[] = [
    {
      id: 'r1',
      name: 'Ngày ngực',
      exerciseIds: ['e1', 'e2'],
    },
  ];

  const renderDetail = (routineId: string) => {
    return render(
      <MemoryRouter initialEntries={[`/routines/${routineId}`]}>
        <RoutineProvider initialRoutines={initialRoutines}>
          <Routes>
            <Route path="/routines/:id" element={<RoutineDetailPage />} />
          </Routes>
        </RoutineProvider>
      </MemoryRouter>
    );
  };

  it('hiển thị thông báo khi không tìm thấy giáo án', () => {
    renderDetail('r-not-found');
    expect(screen.getByText('Không tìm thấy giáo án')).toBeInTheDocument();
  });

  it('hiển thị thông tin giáo án, danh sách bài và tổng thời gian chính xác', () => {
    renderDetail('r1');

    expect(screen.getByText('Ngày ngực')).toBeInTheDocument();
    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
    expect(screen.getByText('Kéo tạ đơn 1')).toBeInTheDocument();
    // e1: 30s, e2: 67s -> tổng 97s = 1 phút 37 giây
    expect(screen.getByText('Tổng thời gian: 1 phút 37 giây')).toBeInTheDocument();
  });

  it('bấm nút Tập tất cả thì bắt đầu buổi tập với danh sách bài trong giáo án', async () => {
    const user = userEvent.setup();
    renderDetail('r1');

    const startAllBtn = screen.getByRole('button', { name: 'Tập tất cả' });
    await user.click(startAllBtn);

    expect(useSessionStore.getState().queue).toHaveLength(2);
    expect(useSessionStore.getState().isRunning).toBe(true);
  });

  it('bấm nút Bỏ thì xóa bài tập khỏi giáo án', async () => {
    const user = userEvent.setup();
    renderDetail('r1');

    const removeBtns = screen.getAllByRole('button', { name: 'Bỏ' });
    await user.click(removeBtns[0]);

    // e1 bị bỏ, chỉ còn e2 (67s = 1 phút 7 giây)
    expect(screen.queryByText('Đẩy tạ đơn 1')).not.toBeInTheDocument();
    expect(screen.getByText('Tổng thời gian: 1 phút 7 giây')).toBeInTheDocument();
  });
});
