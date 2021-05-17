import React from 'react';
import {MutateState} from '../../hooks/useMutate';
import {Pressable} from 'react-native';

export interface MutatorButtonProps {
  state: MutateState;
}

export function MutatorButton(props: MutatorButtonProps) {
  const {state, ...rest} = props;
  return <Pressable {...rest} onPress={()=> state.executeMutation()} />;
}
