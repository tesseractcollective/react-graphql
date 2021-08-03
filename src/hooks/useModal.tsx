import React, { ReactElement, useCallback, useState } from 'react';
import { View } from 'react-native';
import { bs } from '../support';

interface UseModalProps {
  modalComponent?: (row: any)=> ReactElement;
}

export default function useModal(props: UseModalProps) {
  const [shown, setShown] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState();

  const showModal = useCallback((row: any) => {
    setShown(true);
    setSelectedRow(row);
  }, [setShown]);

  const hideModal = useCallback(() => {
    setShown(false);
  }, [setShown]);

  return {
    Modal: shown ? <Modal component={props.modalComponent?.(selectedRow)} /> : null,
    shown,
    showModal,
    hideModal,
  };
}

function Modal(props: any) {
  return (
    <View style={bs(`fixed top-0 left-0 right-0 bottom-0 f f-cc`).single}>
      <View style={bs(``).single}>{props.component}</View>
    </View>
  );
}
