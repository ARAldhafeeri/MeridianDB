import React, {createContext} from "react";
import { message } from "antd";

interface MessageContextType {
  onInfoMessage: (message: string) => void;
  onErrorMessage: (message: string) => void;
  messageContextHolder: React.ReactNode;
}

export const MessageContext = createContext<MessageContextType | undefined>(undefined);

interface MessageContextProviderProps {
  children: React.ReactNode;
}

export const MessageContextProvider = ({ children }: MessageContextProviderProps) => {
  const [messageApi, messageContextHolder] = message.useMessage();

  const onInfoMessage = (message: string) => {
    messageApi.info(message);
  };

  const onErrorMessage = (message: string) => {
    messageApi.error(message);
  };

  return (
    <MessageContext.Provider
      value={{
        onErrorMessage: onErrorMessage,
        messageContextHolder: messageContextHolder,
        onInfoMessage: onInfoMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};