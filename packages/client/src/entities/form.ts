import { BaseComponentProps } from "./base";

export interface FormFieldProps extends BaseComponentProps {
  readonly label: string;
  readonly required?: boolean;
  readonly helpText?: string;
  readonly children: React.ReactNode;
}

export interface SliderInputProps extends BaseComponentProps {
  readonly label: string;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly step?: number;
  readonly onChange: (value: number) => void;
  readonly showValue?: boolean;
}

export interface TagInputProps extends BaseComponentProps {
  readonly label: string;
  readonly tags: string[];
  readonly onTagsChange: (tags: string[]) => void;
  readonly placeholder?: string;
  readonly suggestions?: string[];
}

export interface LoginFormProps extends BaseComponentProps {
  readonly onSubmit: (credentials: {
    readonly email: string;
    readonly password: string;
  }) => void;
}
