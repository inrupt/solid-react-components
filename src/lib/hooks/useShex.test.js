import { useShex } from '@hooks';
import { renderHook, cleanup } from 'react-hooks-testing-library';

describe('useWebId', () => {
    let result;
    beforeAll(() => {
        ({ result } = renderHook(() => useShex()));
    });
    afterAll( () => cleanup);

    it('returns undefined when shexC is not loaded', () => {
        expect(result.current.shexData).toEqual({});
    });

});
