import { renderHook, act } from '@testing-library/react-hooks';
import useOne from './useOne';

it('App loads with initial state of 0', () => {
  const { result } = renderHook(() => useOne());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
