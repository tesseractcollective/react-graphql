import { waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks/dom';
import { useReactGraphql } from '../src/hooks/useReactGraphql';
import HasuraConfig from './TestHasuraConfig';
import { wrapperWithResultValue } from './urqlTestUtils';

const resultValue = { id: '123' };

describe('useQueryOne', () => {
  it('can do a basic query', async () => {
    const wrapper = wrapperWithResultValue(resultValue, 'query');

    const { result } = renderHook(
      () => {
        const reactGraphql = useReactGraphql(HasuraConfig.groups);
        return reactGraphql.useQueryOne({
          variables: { id: 'abc' },
        });
      },
      { wrapper },
    );


    expect(result.current.item).toBeUndefined();

    // await waitFor(() => result.current.executeMutation());
    expect(result.current.item.id).toBe(resultValue.id);
  });
});
