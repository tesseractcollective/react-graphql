import React from 'react';
import {MutateState} from '../../hooks/useMutate';

export interface MutatorButtonProps {
  state: MutateState;
}

export default function MutatorButton(props: MutatorButtonProps) {
  const {state, ...rest} = props;
  return <button {...rest} onClick={()=> state.executeMutation()} />;
}
