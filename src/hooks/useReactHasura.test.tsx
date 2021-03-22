import { renderHook, act } from '@testing-library/react-hooks';
import useQueryByPK from './useQueryByPK';

it('App loads with initial state of 0', () => {
  const { result } = renderHook(() => useQueryByPK());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
