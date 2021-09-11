import { JsonArray } from 'type-fest';
import { OperationContext, useQuery, UseQueryResponse,  } from 'urql';
import { QueryPostMiddlewareState } from '../types/hookMiddleware';

export function useUrqlQuery<TData = any, Variables = object>(
  queryCfg: QueryPostMiddlewareState,
  objectVariables?: { [key: string]: any },
  context?: Partial<OperationContext>,
  pause?: boolean
): UseQueryResponse {
  const response: UseQueryResponse = useQuery<TData>({
    query: queryCfg?.document,
    variables: objectVariables || queryCfg.variables,
    context,
    pause
  });

  return response;
}
