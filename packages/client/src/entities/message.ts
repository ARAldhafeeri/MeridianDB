import { BaseComponentProps } from "./base";

export interface ModalProps extends BaseComponentProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly size?: "sm" | "md" | "lg" | "xl";
  readonly children: React.ReactNode;
}

export interface ConfirmDialogProps extends BaseComponentProps {
  readonly isOpen: boolean;
  readonly title: string;
  readonly message: string;
  readonly confirmText?: string;
  readonly cancelText?: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly variant?: "default" | "danger";
}
