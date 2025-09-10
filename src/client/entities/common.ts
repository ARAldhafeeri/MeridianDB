import React from "react";

import { BaseComponentProps } from "./base";

export interface DataTableProps<T> extends BaseComponentProps {
  readonly data: T[];
  readonly columns: Array<{
    readonly key: keyof T;
    readonly title: string;
    readonly sortable?: boolean;
    readonly render?: (value: any, item: T) => React.ReactNode;
  }>;
  readonly onSort?: (key: keyof T, direction: "asc" | "desc") => void;
  readonly pagination?: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly onPageChange: (page: number) => void;
  };
}

export interface FilterPanelProps extends BaseComponentProps {
  readonly filters: Array<{
    readonly key: string;
    readonly label: string;
    readonly type: "text" | "select" | "date" | "range";
    readonly options?: string[];
    readonly value?: any;
  }>;
  readonly onFilterChange: (key: string, value: any) => void;
  readonly onClear: () => void;
}

export interface StatsCardProps extends BaseComponentProps {
  readonly title: string;
  readonly value: string | number;
  readonly change?: {
    readonly value: number;
    readonly direction: "up" | "down";
    readonly period: string;
  };
  readonly icon?: React.ReactNode;
}

export interface AlertBannerProps extends BaseComponentProps {
  readonly type: "info" | "warning" | "error" | "success";
  readonly message: string;
  readonly dismissible?: boolean;
  readonly onDismiss?: () => void;
}
