import { useShex } from '@hooks';
import { renderHook } from 'react-hooks-testing-library';
import { cleanup } from 'react-testing-library';

const setup = () => {
    return renderHook(() => useShex());
};

describe('useWebId', () => {

    afterAll( () => cleanup);

    it('returns object when shexC is not loaded', async () => {
        const { result } = setup();

        expect(result.current.shexData).toEqual({});
        expect(result.current.addNewShexField).toBeTruthy();
        expect(result.current.updateShexJ).toBeTruthy();
    });


});
