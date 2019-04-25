import { useShex } from '@hooks';
import { renderHook } from 'react-hooks-testing-library';
import { cleanup } from 'react-testing-library';

describe('useWebId', () => {
    let result;
    beforeAll(() => {
        ({ result } = renderHook(() => useShex()));
    });
    afterAll( () => cleanup);

    it('returns object when shexC is not loaded', () => {
        expect(result.current.shexData).toEqual({});
        expect(result.current.addNewShexField).toBeTruthy();
        expect(result.current.updateShexJ).toBeTruthy();
    });

});
