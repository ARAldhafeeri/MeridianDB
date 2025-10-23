import React, { createContext, useState } from "react";
import { Drawer } from "antd";

interface DrawerConfig {
  title?: string;
  content: React.ReactNode;
  width?: number;
}

interface DrawerContextType {
  openDrawer: (config: DrawerConfig) => void;
  closeDrawer: () => void;
  isDrawerOpen: boolean;
}

export const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

interface DrawerContextProviderProps {
  children: React.ReactNode;
}

export const DrawerContextProvider = ({ children }: DrawerContextProviderProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modalConfig, setDrawerConfig] = useState<DrawerConfig | null>(null);

  const openDrawer = (config: DrawerConfig) => {
    setDrawerConfig(config);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setDrawerConfig(null);
  };

  
  return (
    <DrawerContext.Provider
      value={{
        openDrawer,
        closeDrawer,
        isDrawerOpen,
      }}
    >
      {children}
      {modalConfig && (
        <Drawer
          title={modalConfig.title || "Drawer"}
          open={isDrawerOpen}
          onClose={closeDrawer}
          width={modalConfig.width}
          footer={null}
        >
          {modalConfig.content}
        </Drawer>
      )}
    </DrawerContext.Provider>
  );
};