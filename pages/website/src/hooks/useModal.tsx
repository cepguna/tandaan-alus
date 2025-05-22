import { useState } from 'react';

export type TUseModal = {
  aditionalData?: any;
  callbackOnClose?: () => void;
  callbackOnOpen?: () => void;
  defaultValue?: boolean;
};

const useModal = (options?: TUseModal) => {
  const { defaultValue, aditionalData, callbackOnOpen, callbackOnClose } = options || {};
  const [isOpen, setIsOpen] = useState(defaultValue || false);
  const [data, setData] = useState(aditionalData);
  const onClose = (callBackData?: any) => {
    setIsOpen(false);
    if (callBackData) {
      setData(callBackData);
    }
    if (callbackOnClose) {
      callbackOnClose();
    }
  };
  const onOpen = (callBackData?: any) => {
    setIsOpen(true);
    if (callBackData) {
      setData(callBackData);
    }
    if (callbackOnOpen) {
      callbackOnOpen();
    }
  };
  const onToggle = (callBackData?: any) => {
    setIsOpen(prev => !prev);
    if (callBackData) {
      setData(callBackData);
    }
    if (callbackOnOpen) {
      callbackOnOpen();
    }
  };
  return { isOpen, onClose, onOpen, onToggle, data };
};

export default useModal;
