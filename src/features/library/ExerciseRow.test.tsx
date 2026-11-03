import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExerciseRow } from './ExerciseRow';
import type { Exercise } from '../../types';

describe('Component ExerciseRow', () => {
  const mockExercise: Exercise = {
    id: 'e1',
    name: 'Đẩy tạ đơn 1',
    trainer: 'Minh Khang',
    group: 'Ngực',
    duration: 30,
  };

  it('hiển thị tên bài tập và thời lượng "0:30"', () => {
    render(<ExerciseRow exercise={mockExercise} index={0} />);

    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
    expect(screen.getByText('0:30')).toBeInTheDocument();
    expect(screen.getByText('Minh Khang')).toBeInTheDocument();
    expect(screen.getByText('Ngực')).toBeInTheDocument();
  });

  it('bấm nút Bắt đầu (tìm bằng getByRole) thì hàm mock vi.fn() được gọi với đúng bài tập', async () => {
    const user = userEvent.setup();
    const handleStart = vi.fn();

    render(
      <ExerciseRow
        exercise={mockExercise}
        index={0}
        onStart={handleStart}
      />
    );

    const startButton = screen.getByRole('button', { name: 'Bắt đầu' });
    await user.click(startButton);

    expect(handleStart).toHaveBeenCalledTimes(1);
    expect(handleStart).toHaveBeenCalledWith(mockExercise);
  });

  it('bấm nút lưu/bỏ lưu gọi onToggleSave với đúng id', async () => {
    const user = userEvent.setup();
    const handleToggleSave = vi.fn();

    render(
      <ExerciseRow
        exercise={mockExercise}
        index={0}
        isSaved={false}
        onToggleSave={handleToggleSave}
      />
    );

    const saveButton = screen.getByRole('button', { name: 'Lưu bài tập' });
    await user.click(saveButton);

    expect(handleToggleSave).toHaveBeenCalledTimes(1);
    expect(handleToggleSave).toHaveBeenCalledWith('e1');
  });
});
