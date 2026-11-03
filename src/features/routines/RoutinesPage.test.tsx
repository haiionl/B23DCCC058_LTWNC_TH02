import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RoutinesPage } from './RoutinesPage';
import { RoutineProvider } from './RoutineContext';
import type { Routine } from './routineReducer';

const renderWithProviders = (
  ui: React.ReactElement,
  initialRoutines: Routine[] = []
) => {
  return render(
    <MemoryRouter>
      <RoutineProvider initialRoutines={initialRoutines}>
        {ui}
      </RoutineProvider>
    </MemoryRouter>
  );
};

describe('Component RoutinesPage', () => {
  it('bấm Tạo khi ô trống thì thấy "Tên giáo án không được để trống"', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);

    const createButton = screen.getByRole('button', { name: 'Tạo' });
    await user.click(createButton);

    expect(
      screen.getByText('Tên giáo án không được để trống')
    ).toBeInTheDocument();
  });

  it('nhập tên rồi bấm Tạo thì tên xuất hiện trong danh sách', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);

    const input = screen.getByLabelText('Tên giáo án');
    const createButton = screen.getByRole('button', { name: 'Tạo' });

    await user.type(input, 'Giáo án toàn thân');
    await user.click(createButton);

    expect(screen.getByText('Giáo án toàn thân')).toBeInTheDocument();
    expect(screen.getByText('0 bài')).toBeInTheDocument();
  });

  it('báo lỗi "Tên giáo án đã tồn tại" khi tạo trùng tên không phân biệt hoa thường', async () => {
    const user = userEvent.setup();
    const initialRoutines: Routine[] = [
      { id: 'r1', name: 'Ngày ngực', exerciseIds: [] },
    ];
    renderWithProviders(<RoutinesPage />, initialRoutines);

    const input = screen.getByLabelText('Tên giáo án');
    const createButton = screen.getByRole('button', { name: 'Tạo' });

    await user.type(input, 'ngày NGỰC');
    await user.click(createButton);

    expect(screen.getByText('Tên giáo án đã tồn tại')).toBeInTheDocument();
  });
});
