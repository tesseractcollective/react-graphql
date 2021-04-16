import { JsonArray } from 'type-fest';
import { useQuery, UseQueryResponse } from 'urql';
import { QueryPostMiddlewareState } from '../types/hookMiddleware';

export function useUrqlQuery<TData = any, Variables = object>(
  queryCfg: QueryPostMiddlewareState,
  objectVariables?: { [key: string]: any },
): UseQueryResponse {
  const response: UseQueryResponse = useQuery<TData>({
    query: queryCfg?.document,
    variables: objectVariables || queryCfg.variables,
  });

  return response;
}
