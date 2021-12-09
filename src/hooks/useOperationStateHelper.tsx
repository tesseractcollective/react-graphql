import React, {useState, useEffect, ReactElement} from 'react';
import {UseQueryState, CombinedError, UseMutationState} from 'urql';

export interface IUseOperationStateHelperOptions {
  successToastMessage?: string;
  successRender?: (data: any) => ReactElement;
  onSuccess?: (data: any) => void;
  //TODO: confirmBeforeMutation?: { title: string, description: string, okButtonText: string = 'Ok', cancelButtonText?: string, showCloseIcon: boolean }
  errorToastMessage?: string;
  errorRender?: (error: CombinedError) => ReactElement;
  onError?: (error: CombinedError) => void;
  Toast?: any
}

export function useOperationStateHelper(
  queryState: UseQueryState | UseMutationState,
  options: IUseOperationStateHelperOptions,
) {
  const [Error, setError] = useState<ReactElement>();
  const [Success, setSuccess] = useState<ReactElement>();
  const [queryCompleted, setQueryCompleted] = useState(false);
  const [lastFetchingState, setLastFetchingState] = useState(
    queryState.fetching,
  );

  useEffect(() => {
    if (queryState.fetching !== lastFetchingState) {
      setLastFetchingState(queryState.fetching);
      if (!queryState.fetching) {
        setQueryCompleted(true);
      }
    }
  }, [queryState]);

  useEffect(() => {
    if (queryCompleted) {
      if (queryState.error) {
        //TODO: Show error
        if (options.errorToastMessage) {
         options.Toast?.show({
            text2: options.errorToastMessage,
            type: 'error',
            position: 'bottom',
          });
        }
        if (options.errorRender) {
          setError(options.errorRender(queryState.error));
        }
        if (options.onError) {
          options.onError(queryState.error);
        }
      } else if (queryState.data) {
        if (options.successToastMessage) {
          options.Toast?.show({
            text2: options.successToastMessage,
            type: 'success',
            position: 'bottom',
          });
        }
        if (options.successRender) {
          setSuccess(options.successRender(queryState.data));
        }
        if (options.onSuccess) {
          options.onSuccess(queryState.data);
        }
      }
      setQueryCompleted(false);
    }
  }, [queryCompleted]);

  return {
    Error,
    Success,
    queryCompleted,
  };
}
