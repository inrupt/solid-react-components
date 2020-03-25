import { useShex } from '@hooks';
import { renderHook } from '@testing-library/react-hooks';
import { cleanup } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

const setup = () => {
  let component;

  act(() => {
    component = renderHook(() => useShex(null, null, null, { errorCallback: '' }));
  });

  return component;
};

describe('useShex', () => {
  afterAll(() => cleanup);

  it('returns object when shexC is not loaded', async () => {
    const { result } = setup();

    expect(result.current.shexData).toEqual({});
    expect(result.current.addNewShexField).toBeTruthy();
    expect(result.current.updateShexJ).toBeTruthy();
  });
});
