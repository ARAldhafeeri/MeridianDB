import React, { createContext, useState } from "react";
import { Modal } from "antd";

interface ModalConfig {
  title?: string;
  content: React.ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  width?: number;
  closable?: boolean;
  maskClosable?: boolean;
}

interface ModalContextType {
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
  isModalOpen: boolean;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalContextProviderProps {
  children: React.ReactNode;
}

export const ModalContextProvider = ({ children }: ModalContextProviderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

  const openModal = (config: ModalConfig) => {
    setModalConfig(config);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalConfig(null);
  };

  const handleOk = () => {
    if (modalConfig?.onOk) {
      modalConfig.onOk();
    }
    closeModal();
  };

  const handleCancel = () => {
    if (modalConfig?.onCancel) {
      modalConfig.onCancel();
    }
    closeModal();
  };

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        isModalOpen,
      }}
    >
      {children}
      {modalConfig && (
        <Modal
          title={modalConfig.title || "Modal"}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText={modalConfig.okText || "OK"}
          cancelText={modalConfig.cancelText || "Cancel"}
          width={modalConfig.width}
          closable={modalConfig.closable ?? true}
          maskClosable={modalConfig.maskClosable ?? true}
          footer={null}
        >
          {modalConfig.content}
        </Modal>
      )}
    </ModalContext.Provider>
  );
};