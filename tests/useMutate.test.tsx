import { waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks/dom';

import HasuraConfig from './TestHasuraConfig';
import { useReactGraphql } from '../src/hooks/useReactGraphql';
import { wrapperWithResultValue } from './urqlTestUtils';
import { print } from 'graphql';
import { JsonObject } from 'type-fest';

const resultValue = { id: '123' };

describe('useInsert', () => {
  it('sets up an insert', async () => {
    const wrapper = wrapperWithResultValue(resultValue, 'mutation');

    const { result } = renderHook(
      () => {
        const reactGraphql = useReactGraphql(HasuraConfig.groups);
        return reactGraphql.useInsert();
      },
      { wrapper },
    );
    expect(result.current.resultItem).toBeUndefined();

    await waitFor(() => result.current.executeMutation());
    expect(result.current.resultItem?.id).toBe(resultValue.id);
  });

  it('inserts with updating item values', async () => {
    const wrapper = wrapperWithResultValue({ id: '456', groupId: '123', postId: '897' }, 'mutation');

    const { result } = renderHook(
      () => {
        const reactGraphql = useReactGraphql(HasuraConfig.groups);
        return reactGraphql.useInsert<
          { id: string; postId?: string; groupId?: string },
          { id: string; postId?: string; groupId?: string }
        >({
          initialItem: { id: '456', postId: undefined, groupId: undefined },
        });
      },
      { wrapper },
    );
    expect(result.current.resultItem).toBeUndefined();

    act(() => {
      result.current.setItemValue('postId', '897');
    });

    await waitFor(() => result.current.executeMutation({ groupId: '123' }));
    expect(result.current.item.id).toBe('456');
    expect(result.current.item.postId).toBe('897');
    expect(result.current.item.groupId).toBe('123');

    expect(result.current.resultItem?.id).toBe('456');
    expect(result.current.resultItem?.groupId).toBe('123');
    expect(result.current.resultItem?.postId).toBe('897');
  });

  it("throws an error if insert doesn't have required primary key", async () => {
    const wrapper = wrapperWithResultValue(resultValue, 'mutation');

    const { result } = renderHook(
      () => {
        const reactGraphql = useReactGraphql(HasuraConfig.userGroups);
        return reactGraphql.useInsert();
      },
      { wrapper },
    );

    await waitFor(() => result.current.executeMutation()).catch((error) => {
      expect(
        error.message.startsWith(
          'When using useDelete you need to ensure you pass in variables that match the primary keys needed for this type.',
        ),
      ).toBeTruthy();
    });
  });

  it('inserts with updating item values and variables', async () => {
    const wrapper = wrapperWithResultValue(resultValue, 'mutation');

    const { result } = renderHook(
      () => {
        const reactGraphql = useReactGraphql(HasuraConfig.groups);
        return reactGraphql.useInsert();
      },
      { wrapper },
    );
    expect(result.current.resultItem).toBeUndefined();

    act(() => {
      result.current.setItemValue('userId', '8a8a');
      result.current.setVariable('userId', '8a8a');
    });

    await waitFor(() => result.current.executeMutation());
    expect(result.current.resultItem.userId).toBe('8a8a');
    expect(result.current.variables.userId).toBeDefined();
  });
});

describe('useUpdate', () => {
  it('sets up an update', async () => {
    const wrapper = wrapperWithResultValue(resultValue, 'mutation');

    const { result } = renderHook(
      () => {
        const reactGraphql = useReactGraphql(HasuraConfig.groups);
        return reactGraphql.useUpdate({ initialItem: { id: '666' } });
      },
      { wrapper },
    );
    expect(result.current.resultItem).toBeUndefined();
    expect(result.current.mutationConfig.variables.id).toBe('666');

    await waitFor(() => result.current.executeMutation());
    expect(result.current.resultItem?.id).toBe('666');
  });
});

describe('useDelete', () => {
  it('sets up a delete', async () => {
    const wrapper = wrapperWithResultValue(resultValue, 'mutation');

    const { result } = renderHook(
      () => {
        const reactGraphql = useReactGraphql(HasuraConfig.groups);
        return reactGraphql.useDelete({ variables: { id: '666' } });
      },
      { wrapper },
    );
    expect(result.current.resultItem).toBeUndefined();
    expect(result.current.mutationConfig.variables.id).toBe('666');
    expect(result.current.variables.id).toBe('666');

    await waitFor(() => result.current.executeMutation());
    expect(result.current.resultItem?.id).toBe('666');
  });

  it('correctly changes item and variables when calling executeMutation', async () => {
    const wrapper = wrapperWithResultValue(resultValue, 'mutation');

    const { result } = renderHook(
      () => {
        const reactGraphql = useReactGraphql(HasuraConfig.posts);
        return reactGraphql.useInsert<
        { userId: string, groupId: string, postId?: string },
        { userId: string, testVariable?: string, item: any }
        >({ 
          initialVariables: { userId: 'test' },
          initialItem: { userId: 'test', groupId: '123', postId: undefined }
        });
      },
      { wrapper },
    );
    expect(result.current.mutationConfig.variables.userId).toEqual('test');

    await waitFor(() => result.current.executeMutation({ postId: '456' }, { testVariable: 'testVariable' }));
    expect(result.current.mutationConfig.variables.userId).toEqual('test');
    expect((result.current.mutationConfig.variables.item as JsonObject)?.['postId']).toEqual('456');

    await waitFor(() => result.current.executeMutation({ postId: '456' }, { testVariable: 'testVariable' }));
    expect(result.current.mutationConfig.variables.testVariable).toEqual('testVariable');
  });
});
