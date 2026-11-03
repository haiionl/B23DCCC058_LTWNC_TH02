import { describe, it, expect } from 'vitest';
import { generateExercises } from './exercises';

describe('Hàm generateExercises', () => {
  const exercises = generateExercises(10000);

  it('sinh ra đúng 10000 phần tử', () => {
    expect(exercises).toHaveLength(10000);
  });

  it('các phần tử có id không trùng lặp', () => {
    const ids = new Set(exercises.map((e) => e.id));
    expect(ids.size).toBe(10000);
  });

  it('mọi thời lượng bài tập đều nằm trong khoảng 30 đến 120 giây', () => {
    const allInRange = exercises.every(
      (e) => e.duration >= 30 && e.duration <= 120
    );
    expect(allInRange).toBe(true);
  });
});
