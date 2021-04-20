import { OperationContext } from "@urql/core";
import { HasuraDataConfig } from "../hasuraConfig";

export interface UseMutatorProps<T> {
  config: HasuraDataConfig;
  initialVariables?: { [key: string]: any };
  onConflict?: { [key: string]: any };
  networkContext?: Partial<OperationContext>;
}

export interface Mutator {
  setVariable: (key: string, value: any) => void;
  save: () => void;
  deleteAction?: () => void;
}

export interface MutatorState<T> {
  resultItem?: T;
  error?: Error;
  mutating: boolean;
}

export interface MutationConfig {
  mutation: string;
  operationName: string;
  pkColumns?: { [key: string]: any };
}
