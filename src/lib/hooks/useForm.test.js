import { useForm } from '@hooks';
import { renderHook } from 'react-hooks-testing-library';
import { cleanup } from 'react-testing-library';

const setup = () => {
    return renderHook(() => useForm());
};

describe('useForm', () => {

    afterAll( () => cleanup);

    it('returns function and empty object', async () => {
        const { result } = setup();

        expect(result.current.formValues).toEqual({});
        expect(result.current.onChange).toBeTruthy();
        expect(result.current.onSubmit).toBeTruthy();
        expect(result.current.onReset).toBeTruthy();
        expect(result.current.onDelete).toBeTruthy();
    });


});
