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

    expect(result.current.item.id).toBe(resultValue.id);
  });

  it('will throw error if primary key is not in variables', async () => {
    const wrapper = wrapperWithResultValue(resultValue, 'query');

    const { result } = renderHook(
      () => {
        const reactGraphql = useReactGraphql(HasuraConfig.groups);
        return reactGraphql.useQueryOne({
          variables: { somethingElse: 'abc' },
        });
      },
      { wrapper },
    );

    
    let resultError;
    try {
      result.current;
    } catch (error) {
      resultError = error;
    }
    
    expect(resultError).toBeDefined();
  });

  it('will support arbitrary variables', async (done) => {
    const wrapper = wrapperWithResultValue(resultValue, 'query');

    const { result } = renderHook(
      () => {
        const reactGraphql = useReactGraphql(HasuraConfig.posts);
        return reactGraphql.useQueryOne({
          variables: { id: 'abc', userId: '1234' },
        });
      },
      { wrapper },
    );

    expect(result.current.item.userId).toEqual('1234');
    // console.log(result.current.queryState.operation);
  });
});
