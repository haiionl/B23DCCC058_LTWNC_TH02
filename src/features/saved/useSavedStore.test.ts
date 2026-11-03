import { describe, it, expect, beforeEach } from 'vitest';
import { useSavedStore } from './useSavedStore';

describe('useSavedStore', () => {
  beforeEach(() => {
    useSavedStore.setState({ ids: [] });
  });

  it('toggle thêm id nếu chưa có trong danh sách', () => {
    useSavedStore.getState().toggle('e1');
    expect(useSavedStore.getState().ids).toEqual(['e1']);
  });

  it('toggle xóa id nếu đã có trong danh sách', () => {
    useSavedStore.getState().toggle('e1');
    expect(useSavedStore.getState().ids).toEqual(['e1']);

    useSavedStore.getState().toggle('e1');
    expect(useSavedStore.getState().ids).toEqual([]);
  });
});
