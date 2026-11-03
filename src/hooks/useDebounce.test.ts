import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('Hook useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('giữ giá trị ban đầu khi khởi tạo', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('khi đổi giá trị, trước 300ms vẫn là giá trị cũ, sau 300ms chuyển sang giá trị mới', () => {
    const { result, rerender } = renderHook(
      ({ val, delay }: { val: string; delay: number }) => useDebounce(val, delay),
      { initialProps: { val: 'ban dau', delay: 300 } }
    );

    expect(result.current).toBe('ban dau');

    // Cập nhật giá trị mới
    rerender({ val: 'gia tri moi', delay: 300 });

    // Trước 300ms (ví dụ 200ms)
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('ban dau');

    // Sau khi đủ 300ms (thêm 100ms nữa)
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('gia tri moi');
  });
});
